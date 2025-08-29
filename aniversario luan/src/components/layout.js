
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  Info,
  UserCheck,
  Gamepad2,
  Clock,
  Camera,
  Settings,
  Menu,
  X,
  MessageCircle // Added MessageCircle import
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
{
  title: "Convite",
  url: createPageUrl("Convite"),
  icon: Home,
  color: "text-orange-500"
},
{
  title: "Informações",
  url: createPageUrl("Informacoes"),
  icon: Info,
  color: "text-green-500"
},
{
  title: "Confirmação",
  url: createPageUrl("Confirmacao"),
  icon: UserCheck,
  color: "text-blue-500"
},
{
  title: "Jogos",
  url: createPageUrl("Jogos"),
  icon: Gamepad2,
  color: "text-pink-500"
},
{
  title: "Linha do Tempo",
  url: createPageUrl("LinhaTempo"),
  icon: Clock,
  color: "text-purple-500"
},
{
  title: "Fotos",
  url: createPageUrl("Fotos"),
  icon: Camera,
  color: "text-yellow-500"
},
{
  title: "Chat Lulu", // New navigation item
  url: createPageUrl("ChatLulu"),
  icon: MessageCircle,
  color: "text-indigo-500"
},
{
  title: "Admin",
  url: createPageUrl("Admin"),
  icon: Settings,
  color: "text-gray-500"
}];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{
      backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/88d343577_fundo.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <style>
        {`
          :root {
            --primary-orange: #FF6B35;
            --primary-green: #4ECDC4;
            --primary-yellow: #FFD93D;
            --primary-pink: #FF6B9D;
            --primary-blue: #45B7D1;
            --primary-purple: #96CEB4;
          }
          
          .fruit-shadow {
            box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);
          }
          
          .fruit-button {
            background: linear-gradient(145deg, var(--primary-orange), #FF8C5A);
            border: none;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .fruit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(255, 107, 53, 0.4);
          }
        `}
      </style>

      {/* Overlay para legibilidade */}
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Header Mobile */}
      <header className="relative z-50 md:hidden bg-white/90 backdrop-blur-md border-b border-orange-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎂</div>
            <div>
              <h1 className="font-bold text-lg text-orange-600">Luan PachecoPelin</h1>
              <p className="text-sm text-orange-500">Meu primeiro aninho</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-orange-600">

            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen &&
      <div className="relative z-40 md:hidden bg-white/95 backdrop-blur-md border-b border-orange-200">
          <div className="px-4 py-3 space-y-2">
            {navigationItems.map((item) =>
          <Link
            key={item.title}
            to={item.url}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            location.pathname === item.url ?
            'bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300' :
            'hover:bg-orange-50'}`
            }
            onClick={() => setMobileMenuOpen(false)}>

                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium text-gray-700">{item.title}</span>
              </Link>
          )}
          </div>
        </div>
      }

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-72 bg-white/90 backdrop-blur-md border-r border-orange-200 z-30 overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎂</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              LUAN
            </h1>
            <p className="text-lg text-orange-600 font-medium">Meu primeiro aninho</p>
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-2xl">🍎</span>
              <span className="text-2xl">🍌</span>
              <span className="text-2xl">🍓</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {navigationItems.map((item) =>
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
              location.pathname === item.url ?
              'bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 fruit-shadow' :
              'hover:bg-orange-50 hover:transform hover:scale-105'}`
              }>

                <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />ayo
                <span className="font-semibold text-gray-700 group-hover:text-orange-600">
                  {item.title}
                </span>
              </Link>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-20 md:ml-72 min-h-screen">
        {children}
      </main>
    </div>);

}