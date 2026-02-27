#!/bin/bash
# =============================================================================
# YTRC-BackEnd Deploy Script
# Usage: ./deploy.sh [pull|build|up|down|logs|migrate|restart]
# =============================================================================

set -e

COMPOSE_FILE="docker-compose.yml"
APP_NAME="YTRC-BackEnd"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✔ $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠ $1${NC}"; }
err()  { echo -e "${RED}[$(date '+%H:%M:%S')] ✘ $1${NC}"; exit 1; }
info() { echo -e "${BLUE}[$(date '+%H:%M:%S')] ℹ $1${NC}"; }

# Check .env
check_env() {
  if [ ! -f ".env" ]; then
    warn ".env file not found. Copying from .env.example..."
    cp .env.example .env
    err "Please edit .env with your actual values, then re-run deploy.sh"
  fi
  log ".env file found"
}

# Check SSL certs
check_ssl() {
  if [ ! -f "star_ytrc_co_th/fullchain.pem" ] || [ ! -f "star_ytrc_co_th/ytrc.key" ]; then
    err "SSL certificates not found in star_ytrc_co_th/. Required: fullchain.pem and ytrc.key"
  fi
  log "SSL certificates found"
}

# Pull latest code from git
cmd_pull() {
  info "Pulling latest code..."
  git pull origin main
  log "Code updated"
}

# Build Docker images
cmd_build() {
  check_env
  info "Building Docker images..."
  docker compose -f "$COMPOSE_FILE" build --no-cache api
  log "Build complete"
}

# Start all services
cmd_up() {
  check_env
  check_ssl
  info "Starting $APP_NAME..."
  docker compose -f "$COMPOSE_FILE" up -d
  log "All services started"
  echo ""
  docker compose -f "$COMPOSE_FILE" ps
}

# Stop all services
cmd_down() {
  info "Stopping $APP_NAME..."
  docker compose -f "$COMPOSE_FILE" down
  log "All services stopped"
}

# Run Prisma migrations
cmd_migrate() {
  check_env
  info "Running database migrations..."
  docker compose -f "$COMPOSE_FILE" exec api npx prisma migrate deploy
  log "Migrations complete"
}

# View logs
cmd_logs() {
  SERVICE=${2:-}
  docker compose -f "$COMPOSE_FILE" logs -f --tail=100 $SERVICE
}

# Restart a service
cmd_restart() {
  SERVICE=${2:-api}
  info "Restarting $SERVICE..."
  docker compose -f "$COMPOSE_FILE" restart "$SERVICE"
  log "$SERVICE restarted"
}

# Full deploy: pull → build → up → migrate
cmd_deploy() {
  echo ""
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}   $APP_NAME — Full Deploy${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo ""

  check_env
  check_ssl
  cmd_pull
  cmd_build
  cmd_up
  sleep 10
  cmd_migrate
  echo ""
  log "🚀 Deploy complete! https://app.ytrc.co.th/api/v1"
}

# Status
cmd_status() {
  docker compose -f "$COMPOSE_FILE" ps
}

# ===========================================================================
# Main
# ===========================================================================
case "${1:-help}" in
  pull)     cmd_pull ;;
  build)    cmd_build ;;
  up)       cmd_up ;;
  down)     cmd_down ;;
  migrate)  cmd_migrate ;;
  logs)     cmd_logs "$@" ;;
  restart)  cmd_restart "$@" ;;
  deploy)   cmd_deploy ;;
  status)   cmd_status ;;
  help|*)
    echo ""
    echo "Usage: ./deploy.sh <command>"
    echo ""
    echo "Commands:"
    echo "  deploy    Full deploy: pull + build + up + migrate"
    echo "  pull      Pull latest code from git"
    echo "  build     Build Docker images"
    echo "  up        Start all services"
    echo "  down      Stop all services"
    echo "  migrate   Run Prisma database migrations"
    echo "  logs      Follow logs (./deploy.sh logs [service])"
    echo "  restart   Restart a service (./deploy.sh restart [api|nginx|postgres])"
    echo "  status    Show service status"
    echo ""
    ;;
esac
