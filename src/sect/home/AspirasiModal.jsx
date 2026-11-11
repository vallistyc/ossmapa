import { useState } from "react";

const AspirasiModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      await onSubmit({ name, message });
      onClose();
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <div
    className="fixed inset-0 z-[60] grid place-items-center bg-ink/80 p-6 backdrop-blur-md"
    role="dialog"
    aria-modal="true"
    aria-labelledby="aspirasi-title"
  >
    <div className="relative w-full max-w-lg rounded-2xl bg-cream p-7 text-ink sm:p-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 text-2xl"
        aria-label="Tutup"
      >
        ×
      </button>
      <p className="eyebrow text-orange">Ruang aman untuk bicara</p>
      <h2
        id="aspirasi-title"
        className="mt-3 font-outfit text-4xl font-semibold"
      >
        Kirim aspirasi.
      </h2>
      <form
        className="mt-8 space-y-4"
        onSubmit={handleSubmit}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama (opsional)"
          className="w-full border-b border-ink/20 bg-transparent px-0 py-3 font-outfit text-sm outline-none placeholder:text-ink/40 focus:border-orange"
        />
        <textarea
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tulis aspirasi kamu di sini..."
          rows="4"
          className="w-full resize-none border-b border-ink/20 bg-transparent px-0 py-3 font-outfit text-sm outline-none placeholder:text-ink/40 focus:border-orange"
        />
        {status.error && <p className="text-sm text-red-700">{status.error}</p>}
        <button
          type="submit"
          disabled={status.loading}
          className="mt-4 rounded-full bg-ink px-6 py-3 font-outfit text-sm font-semibold text-cream hover:bg-orange hover:text-ink"
        >
          {status.loading ? "Mengirim..." : "Kirim sekarang ↗"}
        </button>
      </form>
      </div>
  </div>
  );
};

export default AspirasiModal;
