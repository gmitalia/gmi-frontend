import React from "react";
import GMIApi from "../../src/api/GMIApi";
import { Button } from "./Button";

type LoginRequiredPageProps = {
  title?: string;
  message: string;
  onBack?: () => void;
};

export default function LoginRequiredPage({ title = "Accesso richiesto", message, onBack }: LoginRequiredPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-2xl font-bold text-content mb-3">{title}</h2>
      <p className="text-content-muted max-w-md mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {onBack && <Button variant="secondary" onClick={onBack}>Torna indietro</Button>}
        <Button variant="primary" size="lg" onClick={() => { GMIApi.getInstance().login(); }}>Accedi con Discord</Button>
      </div>
    </div>
  );
}
