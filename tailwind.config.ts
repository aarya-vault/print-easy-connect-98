
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Poppins', 'system-ui', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Premium PrintEasy Design System
				neutral: {
					50: '#FEFEFE',
					100: '#FDFDFD',
					200: '#F8F9FA',
					300: '#F1F3F4',
					400: '#E8EAED',
					500: '#DADCE0',
					600: '#9AA0A6',
					700: '#5F6368',
					800: '#3C4043',
					900: '#202124',
					950: '#1A1A1A'
				},
				// Premium Golden Yellow System (inspired by reference images)
				golden: {
					50: '#FFFEF7',
					100: '#FFFAEB',
					200: '#FFF2C7',
					300: '#FFE8A3',
					400: '#FFD766',
					500: '#FFC533',  // Primary golden
					600: '#FFB800',  // Rich golden
					700: '#FFA000',  // Deep golden
					800: '#FF8F00',  // Vibrant golden
					900: '#E65100',  // Bold golden
					950: '#BF360C'   // Dark golden
				},
				// Advanced gradient colors
				gradient: {
					'golden-light': '#FFE082',
					'golden-medium': '#FFB74D', 
					'golden-rich': '#FF8F00',
					'golden-deep': '#E65100'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': '16px',
				'2xl': '24px',
				'3xl': '32px'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(255, 181, 77, 0.15)',
				'golden': '0 4px 20px 0 rgba(255, 184, 0, 0.25)',
				'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(0, 0, 0, 0.06)',
				'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -15px rgba(0, 0, 0, 0.1)',
				'premium': '0 20px 60px -10px rgba(255, 184, 0, 0.2), 0 8px 25px -5px rgba(0, 0, 0, 0.1)'
			},
			backgroundImage: {
				'gradient-golden': 'linear-gradient(135deg, #FFE082 0%, #FFB74D 25%, #FFA726 50%, #FF8F00 75%, #E65100 100%)',
				'gradient-golden-soft': 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFE082 100%)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'glass-golden': 'linear-gradient(135deg, rgba(255, 224, 130, 0.1) 0%, rgba(255, 183, 77, 0.05) 100%)'
			},
			backdropBlur: {
				'xs': '2px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.98)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'pulse-golden': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(255, 184, 0, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(255, 184, 0, 0.8)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'pulse-golden': 'pulse-golden 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
