import dotenv from 'dotenv'

export default function env() {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` })
  dotenv.config({ path: '.env.local' })
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
  dotenv.config({ path: '.env' })
}
