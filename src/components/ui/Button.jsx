import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-[0_0_20px_rgba(146,56,229,0.5)]",
        secondary: "bg-transparent border border-primary text-primary hover:bg-primary/10",
        outline: "border border-white/20 text-white hover:bg-white/5",
        ghost: "text-gray-400 hover:text-white"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
