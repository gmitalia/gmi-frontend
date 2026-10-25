import React from "react";
import Link from "next/link";

const VARIANT_MAP = {
  primary: "bg-gray-800 text-white border border-gray-800 hover:bg-gray-700",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100",
  accent: "bg-accent text-white border border-accent hover:bg-accent/90",
  light: "bg-white text-gray-900 border border-white hover:bg-gray-100",
  outlineLight:
    "bg-transparent text-gray-100 border border-white/30 hover:border-white/60 hover:bg-white/10",
  ghost:
    "bg-transparent text-gray-500 border border-transparent hover:text-gray-900 hover:bg-gray-100",
  ghostLight:
    "bg-transparent text-gray-300 border border-transparent hover:text-white hover:bg-white/10",
  text: "text-gray-500 hover:text-gray-900 hover:underline underline-offset-4",
  danger: "text-error hover:bg-error/10 border border-error/30",
  success: "text-success hover:bg-success/10 border border-success/30",
} as const;

const SIZE_MAP = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3",
  icon: "p-2",
} as const;

export type ButtonVariant = keyof typeof VARIANT_MAP;
export type ButtonSize = keyof typeof SIZE_MAP;

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick" | "type" | "href"
>;

export const Button = ({
  variant = "primary",
  size = "md",
  disabled,
  onClick,
  href,
  icon,
  children,
  className = "",
  type,
  ...rest
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-150";
  const variantClasses = VARIANT_MAP[variant] || VARIANT_MAP.primary;
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const disabledClasses = disabled ? "opacity-50 pointer-events-none select-none" : "";
  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`;

  const onClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    }
  };

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children && <span className="min-w-0">{children}</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={allClasses}
        onClick={onClickHandler}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClickHandler}
      className={allClasses}
      {...rest}
    >
      {content}
    </button>
  );
};
