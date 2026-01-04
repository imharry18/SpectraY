'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, href, color, disabled = false, delay }) => {
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
      className={`relative h-full p-8 rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden group transition-all duration-300 ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/20 hover:shadow-2xl hover:shadow-' + color + '/10'
      }`}
    >
      {/* Background Gradient Blob */}
      {!disabled && (
        <div 
          className={`absolute -right-10 -top-10 w-40 h-40 bg-${color}-500/20 blur-[80px] rounded-full group-hover:bg-${color}-500/30 transition-all duration-500`} 
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-white/5 text-${color}-400 group-hover:bg-${color}-500 group-hover:text-white transition-colors duration-300`}>
          <Icon size={32} strokeWidth={1.5} />
        </div>
        {disabled && <Lock className="text-gray-600" size={20} />}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
          {title}
        </h3>
        <p className="text-gray-400 mb-8 leading-relaxed text-sm">
          {description}
        </p>

        {/* Action Area */}
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          {disabled ? (
            <span className="text-gray-600 flex items-center gap-2">Coming Soon</span>
          ) : (
            <span className={`text-${color}-400 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300`}>
              Open Workspace <ArrowRight size={16} />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return disabled ? (
    <div className="h-full">{CardContent}</div>
  ) : (
    <Link href={href} className="block h-full">
      {CardContent}
    </Link>
  );
};

export default FeatureCard;