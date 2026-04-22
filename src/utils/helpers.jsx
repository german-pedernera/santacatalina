export async function resizeImage(file, maxW = 900, maxH = 900, q = 0.78) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        res(canvas.toDataURL('image/jpeg', q));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}

export function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return 'Ahora mismo';
  const m = Math.floor(s / 60);
  if (m < 60)  return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)} días`;
}

export function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const WA_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#25D366" d="M12.031 0C5.39 0 0 5.39 0 12.031c0 2.125.563 4.188 1.594 5.969L.031 24l6.125-1.625c1.781 1.031 3.781 1.594 5.875 1.594 6.641 0 12.031-5.39 12.031-12.031C24.062 5.39 18.672 0 12.031 0z"/>
    <path fill="#FFF" d="M12.031 1.594c-5.781 0-10.438 4.656-10.438 10.438 0 2.031.594 4.031 1.719 5.719l-.125-.188L2.156 21.844l4.313-1.125.219.125c1.625.969 3.5 1.469 5.406 1.469 5.781 0 10.438-4.656 10.438-10.438s-4.656-10.438-10.438-10.438zm6.531 14.813c-.281.781-1.406 1.438-1.938 1.531-.5.094-.969.313-2.844-.438-2.375-.938-3.906-3.344-4.031-3.5-.125-.156-1.031-1.375-1.031-2.625 0-1.25.656-1.875.875-2.125.219-.25.5-.313.656-.313.156 0 .313 0 .469.031.156.031.344-.063.531.406.188.469.656 1.594.719 1.719.063.125.094.281.031.438-.063.156-.125.25-.25.406-.125.156-.281.344-.406.469-.125.125-.281.281-.125.563.156.281.688 1.125 1.469 1.813.969.875 1.781 1.156 2.094 1.313.313.156.5-.031.688-.219.188-.188.781-.906 1-1.219.219-.313.438-.25.75-.125.313.125 2 .938 2.344 1.125.344.188.563.281.656.438.094.156.094.625-.188 1.406z"/>
  </svg>
);

export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{6,10}$/;

export const SECURITY_QUESTIONS = [
  "¿Nombre de tu primera mascota?",
  "¿Ciudad donde naciste?",
  "¿Nombre de tu escuela primaria?",
  "¿Marca de tu primer auto?"
];
