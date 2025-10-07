"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Users, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import emailjs from '@emailjs/browser'

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch via email",
    contact: "narendra.insights@gmail.com",
    action: "mailto:hello@snapcook.com",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    borderGradient: "from-blue-300 to-cyan-300"
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team",
    contact: "+91 9035568277",
    action: "tel:+15551234567",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    borderGradient: "from-green-300 to-emerald-300"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our office location",
    contact: "AMARAVATHI",
    action: "#",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    borderGradient: "from-purple-300 to-pink-300"
  }
]

const faqs = [
  {
    question: "How does SnapCook's AI recipe generation work?",
    answer: "Our advanced AI analyzes your ingredients, dietary preferences, and cooking skill level to create personalized recipes that match your taste and available ingredients."
  },
  {
    question: "Can I save and organize my favorite recipes?",
    answer: "Absolutely! You can save unlimited recipes, organize them into collections, and access them anytime from any device with your account."
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes! We provide 24/7 customer support through email, and premium users get priority phone support. Our team is always ready to help with any questions."
  },
  {
    question: "Is there a mobile app available?",
    answer: "SnapCook is fully responsive and works perfectly on all devices. We're also developing dedicated mobile apps for iOS and Android coming soon!"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
}

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, delay: 0.3 }
  }
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      
      // Template parameters that match your EmailJS template
      const templateParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        time: new Date().toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'medium'
        })
      }
      
      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      
      // Enhanced success notification
      toast.success(
        `Thank you, ${formData.name}! 🎉 Your message has been sent successfully. We'll respond within 24 hours.`,
        {
          duration: 6000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          }
        }
      )
      
      // Reset form only on successful submission
      setFormData({ name: "", email: "", subject: "", message: "" })
      
    } catch (error: any) {
      console.error('EmailJS error:', error)
      
      // Enhanced error handling with specific messages
      let errorMessage = ''
      
      if (error?.status === 400) {
        errorMessage = '❌ Please check your information and try again. Some fields may be invalid.'
      } else if (error?.status === 429) {
        errorMessage = '⏳ Too many requests. Please wait a moment and try again.'
      } else if (error?.text?.includes('network') || error?.name === 'NetworkError') {
        errorMessage = '🌐 Network error. Please check your connection and try again.'
      } else if (error?.status === 401 || error?.status === 403) {
        errorMessage = '🔐 Service temporarily unavailable. Please try again later.'
      } else {
        errorMessage = '⚠️ Message failed to send. Please try again or contact us directly.'
      }
      
      toast.error(errorMessage, {
        duration: 8000,
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2
            }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-6"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Get In</span>
            <br />
            <span className="text-gray-900">Touch</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Have questions about SnapCook? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.title}
                variants={cardVariants}
                whileHover="hover"
                className="relative"
              >
                <Card className={`relative h-full bg-gradient-to-br ${method.bgGradient} border-2 border-transparent bg-clip-border shadow-lg transition-all duration-300 group cursor-pointer`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${method.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -m-[2px] -z-10`}></div>
                  
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.3 + index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${method.gradient} text-white mx-auto mb-4 shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {method.title}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-600">
                      {method.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-center">
                    <a 
                      href={method.action}
                      className={`text-sm font-medium bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent hover:underline transition-all duration-300`}
                    >
                      {method.contact}
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Contact Form and Info Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Send className="w-6 h-6 text-blue-500" />
                  Send Us a Message
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Input
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Info & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* About Section */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  About SnapCook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  SnapCook is revolutionizing home cooking with AI-powered recipe generation. 
                  Our mission is to make cooking accessible, fun, and personalized for everyone, 
                  regardless of their skill level or available ingredients.
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Happy Cooks</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <CardContent className="pt-6 text-center">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </CardContent>
              </Card>
            </div>

            {/* Office Hours */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="gradient-text">Frequently Asked</span> Questions
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                    {faq.question}
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-blue-500"
                    >
                      ▼
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedFaq === index ? "auto" : 0,
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </motion.div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-2xl">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Cooking?</h3>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">
                Join thousands of home cooks who are already creating amazing meals with SnapCook's AI-powered recipes.
              </p>
              <Button 
                variant="secondary"
                size="lg"
                className="font-semibold bg-white text-blue-600 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}