import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/hooks/useHapticFeedback";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "glass-button-primary",
        destructive: "glass-button-destructive",
        outline: "glass-button border-border/50 hover:border-primary/30",
        secondary: "glass-button-secondary",
        ghost: "hover:bg-muted/60 hover:text-foreground rounded-2xl",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass-button",
        "glass-primary": "glass-button glass-button-primary",
        "glass-secondary": "glass-button glass-button-secondary",
      },
      size: {
        default: "h-12 px-5 py-3 rounded-2xl",
        sm: "h-10 px-4 py-2.5 rounded-xl text-sm",
        lg: "h-14 px-8 py-4 rounded-2xl text-base",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | false;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, haptic = 'light', onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic) {
        triggerHaptic(haptic);
      }
      onClick?.(e);
    };
    
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref}
        onClick={asChild ? onClick : handleClick}
        {...props} 
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };