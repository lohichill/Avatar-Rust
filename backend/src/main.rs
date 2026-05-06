use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
    response::IntoResponse,
    http::StatusCode,
};
use serde::{Serialize, Deserialize};
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool};
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{encode, Header, EncodingKey};
use uuid::Uuid;
use chrono::{Utc, Duration};

// --- Configuration ---
struct AppState {
    db: PgPool,
    jwt_secret: String,
}

type SharedState = Arc<AppState>;

#[derive(Serialize, Deserialize)]
struct User {
    id: Uuid,
    username: String,
    email: String,
    avatar_url: Option<String>,
    level: i32,
}

#[derive(Deserialize)]
struct AuthRequest {
    username: String,
    password: String,
}

#[derive(Serialize)]
struct AuthResponse {
    token: String,
    user: User,
}

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

// --- Handlers ---

async fn register(
    State(state): State<SharedState>,
    Json(payload): Json<AuthRequest>,
) -> impl IntoResponse {
    let password_hash = match hash(&payload.password, DEFAULT_COST) {
        Ok(h) => h,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, "Hashing error").into_response(),
    };
    
    let result = sqlx::query!(
        "INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id, username, email, avatar_url, level",
        payload.username,
        password_hash,
        format!("{}@example.com", payload.username)
    )
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(row) => {
            let user = User {
                id: row.id,
                username: row.username,
                email: row.email,
                avatar_url: row.avatar_url,
                level: row.level,
            };
            (StatusCode::CREATED, Json(user)).into_response()
        },
        Err(_) => (StatusCode::BAD_REQUEST, "Username already exists").into_response(),
    }
}

async fn login(
    State(state): State<SharedState>,
    Json(payload): Json<AuthRequest>,
) -> impl IntoResponse {
    let user_row = sqlx::query!(
        "SELECT id, password_hash, username, email, avatar_url, level FROM users WHERE username = $1",
        payload.username
    )
    .fetch_optional(&state.db)
    .await;

    match user_row {
        Ok(Some(row)) => {
            if verify(&payload.password, &row.password_hash).unwrap_or(false) {
                let claims = Claims {
                    sub: row.id.to_string(),
                    exp: (Utc::now() + Duration::days(30)).timestamp() as usize,
                };
                let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(state.jwt_secret.as_ref())).unwrap();
                
                let user = User {
                    id: row.id,
                    username: row.username,
                    email: row.email,
                    avatar_url: row.avatar_url,
                    level: row.level,
                };
                (StatusCode::OK, Json(AuthResponse { token, user })).into_response()
            } else {
                (StatusCode::UNAUTHORIZED, "Invalid password").into_response()
            }
        },
        Ok(None) => (StatusCode::UNAUTHORIZED, "User not found").into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Database error").into_response(),
    }
}

async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "ok",
        "message": "Avatar 2.0 Heartbeat is strong! 🌸"
    }))
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let db_url = "postgres://postgres:avatar_secret@127.0.0.1:5433/avatar_db";
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("Cannot connect to database");

    let state = Arc::new(AppState {
        db: pool,
        jwt_secret: "avatar_super_secret_key_2026".to_string(),
    });

    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .with_state(state)
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3030));
    println!("🚀 Avatar 2.0 Backend running on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
