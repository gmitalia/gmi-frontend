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
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center py-12">
      <div className="w-full border border-gray-200 bg-white p-8 text-center md:p-12">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {onBack && <Button variant="secondary" onClick={onBack}>Torna indietro</Button>}
          <Button variant="primary" onClick={() => { GMIApi.getInstance().login(); }}>Accedi con Discord</Button>
        </div>
      </div>
    </div>
  );
}
