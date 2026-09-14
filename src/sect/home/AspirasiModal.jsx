const AspirasiModal = ({ onClose }) => (
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
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <input
          required
          placeholder="Nama (opsional)"
          className="w-full border-b border-ink/20 bg-transparent px-0 py-3 font-outfit text-sm outline-none placeholder:text-ink/40 focus:border-orange"
        />
        <textarea
          required
          placeholder="Tulis aspirasi kamu di sini..."
          rows="4"
          className="w-full resize-none border-b border-ink/20 bg-transparent px-0 py-3 font-outfit text-sm outline-none placeholder:text-ink/40 focus:border-orange"
        />
        <button
          type="submit"
          className="mt-4 rounded-full bg-ink px-6 py-3 font-outfit text-sm font-semibold text-cream hover:bg-orange hover:text-ink"
        >
          Kirim sekarang ↗
        </button>
      </form>
    </div>
  </div>
);

export default AspirasiModal;
