// Deliberately does NOT declare its own <html>/<body> — the mandatory
// root layout (app/layout.tsx) already does that for every route in the
// app, /studio included. A nested layout redeclaring <html>/<body>
// produces two conflicting document roots and is invalid; the correct
// way to get the embedded Studio's full-height, no-scroll chrome is a
// styled wrapper element instead.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0, height: "100vh", overflow: "hidden" }}>
      {children}
    </div>
  );
}
