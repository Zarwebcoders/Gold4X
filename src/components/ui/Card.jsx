import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", noHover = false }) => {
    return (
        <motion.div
            whileHover={!noHover ? { scale: 1.02, boxShadow: "0px 0px 15px rgba(146, 56, 229, 0.3)" } : {}}
            className={`bg-secondary border border-white/10 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm ${className}`}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-highlight opacity-50" />
            {children}
        </motion.div>
    );
};

export default Card;
