import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				'50': 'hsl(250, 100%, 97%)',
    				'100': 'hsl(250, 95%, 92%)',
    				'200': 'hsl(250, 90%, 85%)',
    				'300': 'hsl(250, 85%, 75%)',
    				'400': 'hsl(250, 80%, 65%)',
    				'500': 'hsl(250, 70%, 55%)',
    				'600': 'hsl(250, 65%, 45%)',
    				'700': 'hsl(250, 60%, 35%)',
    				'800': 'hsl(250, 55%, 25%)',
    				'900': 'hsl(250, 50%, 15%)',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			accent: {
    				'500': 'hsl(185, 80%, 50%)',
    				'600': 'hsl(185, 75%, 40%)',
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			success: {
    				DEFAULT: 'hsl(142, 76%, 45%)',
    				foreground: 'hsl(142, 76%, 95%)'
    			},
    			warning: {
    				DEFAULT: 'hsl(38, 92%, 50%)',
    				foreground: 'hsl(38, 92%, 10%)'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontFamily: {
    			sans: [
    				'var(--font-inter)',
    				'system-ui',
    				'sans-serif'
    			],
    			display: [
    				'var(--font-outfit)',
    				'var(--font-inter)',
    				'sans-serif'
    			],
    			mono: [
    				'var(--font-jetbrains)',
    				'monospace'
    			]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
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
    			shimmer: {
    				'0%': {
    					backgroundPosition: '-1000px 0'
    				},
    				'100%': {
    					backgroundPosition: '1000px 0'
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
    			'slide-in': {
    				'0%': {
    					transform: 'translateX(-100%)'
    				},
    				'100%': {
    					transform: 'translateX(0)'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			shimmer: 'shimmer 2s infinite linear',
    			'fade-in': 'fade-in 0.5s ease-out',
    			'slide-in': 'slide-in 0.3s ease-out'
    		},
    		backgroundImage: {
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    			'gradient-primary': 'linear-gradient(135deg, hsl(250, 70%, 55%), hsl(220, 70%, 55%))',
    			'gradient-accent': 'linear-gradient(135deg, hsl(185, 80%, 50%), hsl(250, 70%, 55%))'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
