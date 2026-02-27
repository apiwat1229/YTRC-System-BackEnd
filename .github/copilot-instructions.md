# YTRC-BackEnd Copilot Instructions

## Project Overview
NestJS + Prisma backend service for YTRC project.

## Tech Stack
- **Framework**: NestJS (latest)
- **ORM**: Prisma (latest)
- **Language**: TypeScript
- **Runtime**: Node.js

## Development Guidelines
- Use NestJS modules, controllers, and services pattern
- Use Prisma for all database operations
- Follow RESTful API conventions
- Use DTOs for request/response validation
- Use class-validator for input validation
- Use environment variables via @nestjs/config

## Project Structure
- `src/` - Source code
  - `modules/` - Feature modules
  - `common/` - Shared utilities, decorators, guards
  - `prisma/` - Prisma service module
- `prisma/` - Prisma schema and migrations
