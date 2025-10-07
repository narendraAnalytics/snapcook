"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Heart, Instagram, Twitter, Facebook, Youtube, Github, ChefHat, Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"

const footerLinks = {
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press Kit", href: "#" }
    ]
  },
  product: {
    title: "Product", 
    links: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Docs", href: "#" },
      { name: "Mobile App", href: "#" },
      { name: "Integrations", href: "#" }
    ]
  },
  support: {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#contact" },
      { name: "FAQ", href: "#" },
      { name: "Community", href: "#" },
      { name: "Status Page", href: "#" }
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Security", href: "#" },
      { name: "GDPR", href: "#" }
    ]
  }
}

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/snapcook",
    gradient: "from-pink-500 to-purple-500"
  },
  {
    name: "Twitter",
    icon: Twitter, 
    href: "https://twitter.com/snapcook",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://facebook.com/snapcook", 
    gradient: "from-blue-600 to-blue-800"
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "https://youtube.com/snapcook",
    gradient: "from-red-500 to-red-700"
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/snapcook",
    gradient: "from-gray-700 to-gray-900"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    
    // Simulate newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("🎉 Thanks for subscribing! You'll get our best recipes delivered weekly.")
    setEmail("")
    setIsSubmitting(false)
  }

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.slice(1))
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-6 gap-12 mb-12"
        >
          {/* Brand Section - Takes 2 columns */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/snapcooklogo.png"
                  alt="SnapCook Logo"
                  width={40}
                  height={40}
                  className="transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg"></div>
              </div>
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  SnapCook
                </span>
              </h3>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-md">
              Revolutionizing home cooking with AI-powered recipe generation. 
              Create personalized recipes instantly with ingredients you already have.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 font-medium">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${social.gradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}></div>
                      <div className="relative w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Footer Links - 4 columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <motion.div 
              key={key}
              variants={itemVariants}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault()
                          scrollToSection(link.href)
                        }
                      }}
                      className="text-gray-400 hover:text-orange-400 transition-all duration-300 text-sm block py-1 hover:translate-x-1 transform"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Stay Updated</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Get the latest recipes, cooking tips, and AI-powered meal ideas delivered to your inbox weekly.
                  </p>
                </div>
                
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/50"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>© {currentYear} SnapCook. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-orange-400 transition-colors duration-300">Sitemap</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-orange-400 transition-colors duration-300">Accessibility</a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>for home cooks</span>
              <div className="flex items-center gap-1 ml-2">
                <ChefHat className="w-4 h-4 text-orange-400" />
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}