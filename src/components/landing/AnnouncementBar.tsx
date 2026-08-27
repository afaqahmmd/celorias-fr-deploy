interface AnnouncementBarProps {
  message: string;
}

export default function AnnouncementBar({ message }: AnnouncementBarProps) {
  return (
    <div className="bg-dark-green px-4 py-2.5 text-center text-sm tracking-wide text-pretty text-white">
      <span aria-hidden="true">✦ </span>
      {message}
      <span aria-hidden="true"> ✦</span>
    </div>
  );
}
