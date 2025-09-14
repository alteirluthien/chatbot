// src/app/page.js
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to chatbot page
  redirect('/login');
}