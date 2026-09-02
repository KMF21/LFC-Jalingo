export type LeaderData = {
  name: string;
  role: string;
  photoUrl?: string;
};

export default function LeaderCard({ leader }: { leader: LeaderData }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper-dim p-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-ink/10">
        {leader.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={leader.photoUrl} alt={leader.name} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-ink">{leader.name}</p>
        <p className="text-xs text-ink-muted">{leader.role}</p>
      </div>
    </div>
  );
}
