import Button from '../components/ui/Button';
import Spectrum from '../components/ui/Spectrum';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Spectrum className="w-40" />
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-[-0.04em] lg:text-6xl">
        This aisle does not exist
      </h1>
      <p className="mt-4 max-w-md text-base text-ink-soft">
        The page you asked for is not part of the marketplace. The catalogue is one click away.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/shop" size="lg">Browse all products</Button>
        <Button to="/" variant="outline" size="lg">Back to home</Button>
      </div>
    </div>
  );
}
