# FloristSocial Architecture

## Stack
- Next.js
- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase RLS
- Stripe senare

## Core tables
- florists
- products
- posts
- follows
- post_likes
- post_comments
- conversations
- messages

## Storage
- post-media bucket
- används för bild/video i feed

## Roles
- admin
- florist
- customer

## Access rules
- Feed: inloggade användare
- Kommentarer: alla inloggade
- Likes: alla inloggade
- Follow: alla inloggade
- Florist-chat: endast florister i V1
- Admin: endast admin
- Shop: customer
- Dashboard: florist

## Product direction
FloristSocial är social commerce:
- feed ska leda till produkter
- produkter ska leda till order
- floristprofiler ska bygga förtroende
- chat ska stödja B2B mellan florister
