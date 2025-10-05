"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import SignInModal from "@/components/sign-in-modal"

const pricingPlans = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "Always free",
    description: "Perfect for getting started with AI-powered recipes",
    features: [
      "2 recipes/month",
      "Limited suggestions",
      "Basic recipe generation",
      "Community support"
    ],
    icon: <Star className="w-6 h-6" />,
    popular: false,
    gradient: "from-blue-50 to-indigo-50",
    borderGradient: "from-blue-200 to-indigo-200",
    buttonVariant: "outline" as const
  },
  {
    name: "Pro",
    monthlyPrice: "$4",
    yearlyPrice: "$40",
    yearlyDiscount: "Save $8",
    period: "/month",
    description: "Ideal for cooking enthusiasts and home chefs",
    features: [
      "8 recipes/month",
      "Advanced suggestions",
      "Premium recipe templates",
      "Nutritional information",
      "Recipe customization",
      "Priority support"
    ],
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    gradient: "from-orange-50 to-red-50",
    borderGradient: "from-orange-300 to-red-300",
    buttonVariant: "default" as const
  },
  {
    name: "Max",
    monthlyPrice: "$15",
    yearlyPrice: "$150",
    yearlyDiscount: "Save $30",
    period: "/month",
    description: "For professional chefs and culinary experts",
    features: [
      "Unlimited recipes",
      "Modern AI suggestions",
      "Professional recipe formats",
      "Advanced nutritional analysis",
      "Custom dietary preferences",
      "Recipe video generation",
      "Premium support",
      "API access"
    ],
    icon: <Crown className="w-6 h-6" />,
    popular: false,
    gradient: "from-purple-50 to-pink-50",
    borderGradient: "from-purple-300 to-pink-300",
    buttonVariant: "default" as const
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
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
}

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-24 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white mb-6"
          >
            <Crown className="w-8 h-8" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Choose Your</span>
            <br />
            <span className="text-gray-900">Culinary Journey</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Unlock the power of AI-driven recipe creation with plans designed for every cooking enthusiast
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                !isYearly
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative ${
                isYearly
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
              >
                Save
              </motion.span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-3 gap-8 mb-16"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              whileHover="hover"
              className="relative"
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    Most Popular
                  </Badge>
                </motion.div>
              )}
              
              <Card className={`relative h-full bg-gradient-to-br ${plan.gradient} border-2 border-transparent bg-clip-border ${plan.popular ? 'shadow-2xl shadow-orange-500/20' : 'shadow-lg'} transition-all duration-300 group`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -m-[2px] -z-10`}></div>
                
                <CardHeader className="text-center pb-4">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg text-orange-500 mx-auto mb-4"
                  >
                    {plan.icon}
                  </motion.div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mt-4">
                    <motion.span
                      key={isYearly ? 'yearly' : 'monthly'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl font-bold text-gray-900"
                    >
                      {plan.name === 'Free' 
                        ? plan.monthlyPrice 
                        : isYearly 
                          ? plan.yearlyPrice 
                          : plan.monthlyPrice
                      }
                    </motion.span>
                    <span className="text-gray-600 ml-1">
                      {plan.name === 'Free' 
                        ? plan.period 
                        : isYearly 
                          ? '/year' 
                          : '/month'
                      }
                    </span>
                    {isYearly && plan.yearlyDiscount && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2"
                      >
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {plan.yearlyDiscount}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  <CardDescription className="text-gray-600 mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        variants={featureVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center space-x-3"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 + featureIndex * 0.05 }}
                          className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-green-600" />
                        </motion.div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="w-full"
                  >
                    <SignedOut>
                      <SignInModal>
                        <Button 
                          variant={plan.buttonVariant}
                          size="lg"
                          className={`w-full font-semibold transition-all duration-300 ${
                            plan.popular 
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                              : plan.name === 'Max'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                : 'hover:scale-105'
                          }`}
                        >
                          {plan.name === 'Free' ? 'Get Started' : 'Subscribe Now'}
                        </Button>
                      </SignInModal>
                    </SignedOut>
                    
                    <SignedIn>
                      <Button 
                        variant={plan.buttonVariant}
                        size="lg"
                        className={`w-full font-semibold transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                            : plan.name === 'Max'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                              : 'hover:scale-105'
                        }`}
                        onClick={() => {
                          // Handle subscription logic for authenticated users
                          console.log(`Subscribing to ${plan.name} plan`)
                        }}
                      >
                        {plan.name === 'Free' ? 'Current Plan' : 'Subscribe Now'}
                      </Button>
                    </SignedIn>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>


        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">
            Need a custom plan for your restaurant or business?
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="font-semibold border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
          >
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </section>
  )
}