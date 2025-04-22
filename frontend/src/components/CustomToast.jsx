import { toast } from "sonner";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Sparkles, XCircle } from "lucide-react";

const CustomToast = (type, message, options = {}) => {
    const { duration = 5000, ...rest } = options;

    const typeStyles = {
        success: {
            gradient: "from-[#3A59D1] to-[#7AC6D2]",
            icon: <Sparkles className="h-5 w-5" />,
        },
        error: {
            gradient: "from-red-500 to-rose-500",
            icon: <XCircle className="h-5 w-5" />,
        },
        warning: {
            gradient: "from-yellow-500 to-amber-500",
            icon: <AlertTriangle className="h-5 w-5" />,
        },
        info: {
            gradient: "from-blue-500 to-indigo-500",
            icon: <Info className="h-5 w-5" />, 
        },
    };

    if (!typeStyles[type]) {
        console.error(`Invalid toast type: ${type}`);
        return;
    }

    const { gradient, icon } = typeStyles[type];

    toast.custom(
        (t) => (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-gradient-to-r ${gradient} text-white p-4 rounded-lg shadow-xl flex items-center gap-3`}
                {...rest}
            >
                <div className="bg-white/20 rounded-full p-2">{icon}</div>
                <div>
                    <p className="font-medium">{message}</p>
                </div>
            </motion.div>
        ),
        { duration }
    );
};

export default CustomToast