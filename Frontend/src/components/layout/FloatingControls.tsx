import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingControls = () => {
  return (
    <Link
      to="/chat"
      className="fixed bottom-6 right-6 w-16 h-16 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-30"
    >
      <MessageCircle className="w-7 h-7" />
    </Link>
  );
};

export default FloatingControls;