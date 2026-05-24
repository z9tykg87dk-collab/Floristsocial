type FSSectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function FSSectionTitle({ eyebrow, title, subtitle, action }: FSSectionTitleProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-pink-600">
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-black tracking-tight text-stone-950 md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
