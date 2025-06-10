import { motion } from "framer-motion";

export function PresenceAnimation({ as, children, ...props }) {
  let Component = as ? motion[as] : motion.div;

  return (
    <Component
      initial={{ y: -20, opacity: 0, height: 0 }}
      animate={{ y: 0, opacity: 1, height: "auto" }}
      exit={{ y: -20, opacity: 0, height: 0 }}
      {...props}
    >
      {children}
    </Component>
  );
}