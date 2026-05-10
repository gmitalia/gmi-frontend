import React from "react";
import GMIApi from "../../src/api/GMIApi";
import { UsersIcon, ChevronLeftIcon, DiscordIcon } from "./Icons";
import { Button } from "./Button";

export default function LoginRequiredPage({ title = "Accesso richiesto", message, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6 p-4 rounded-full bg-surface-muted border border-secondary/30">
        <UsersIcon size={48} className="text-secondary" />
      </div>
      <h2 className="text-2xl font-bold text-content mb-3">{title}</h2>
      <p className="text-content-muted max-w-md mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" onClick={onBack} icon={<ChevronLeftIcon size={20} />}>Torna indietro</Button>
        <Button variant="primary" size="lg" onClick={() => { GMIApi.getInstance().login(); }} icon={<DiscordIcon size={20} />}>Accedi con Discord</Button>
      </div>
    </div>
  );
}
