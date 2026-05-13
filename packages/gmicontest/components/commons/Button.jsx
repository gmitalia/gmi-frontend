import React from "react";
import Link from "next/link";

const VARIANT_MAP = {
  primary:
    "bg-secondary text-on-secondary font-semibold shadow-lg shadow-secondary/25 border border-white/10 hover:bg-secondary/90 hover:shadow-secondary/40 hover:-translate-y-0.5",
  secondary:
    "bg-content/5 text-content border border-default relative overflow-hidden font-semibold rounded-cta hover:bg-content/10 hover:-translate-y-0.5 focus:bg-content/10 focus:-translate-y-0.5",
  accent:
    "bg-accent/5 text-accent border border-accent/20 relative overflow-hidden font-semibold rounded-cta hover:bg-accent/10 hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(var(--ds-rgb-accent),0.2)] focus:bg-accent/10 focus:-translate-y-0.5 focus:shadow-[0_0_10px_rgba(var(--ds-rgb-accent),0.2)]",
  ghost:
    "bg-surface-solid text-secondary border border-default hover:text-content/80 hover:-translate-y-0.5",
  text:
    "text-content-muted hover:text-content hover:underline underline-offset-4",
  danger:
    "text-error hover:bg-error/20 border border-error/20 hover:border-error/40",
  success:
    "text-success hover:bg-success/20 border border-success/20",
};

const SIZE_MAP = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3",
  icon: "p-2",
};

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
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200";
  const variantClasses = VARIANT_MAP[variant] || VARIANT_MAP.primary;
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const disabledClasses = disabled ? "opacity-50 pointer-events-none select-none" : "";
  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`;

  const onClickHandler = (event) => {
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
      <Link href={href}>
        <a className={allClasses} onClick={onClickHandler} {...rest}>
          {content}
        </a>
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
