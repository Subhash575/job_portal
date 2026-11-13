import Navbar from '../shared/Navbar';
import PageHeader from '../shared/PageHeader';
import SeatIllustration from '../SeatIllustration';

// Form on the left, the seat drawing on a lavender panel on wide screens.
const AuthLayout = ({ eyebrow, title, children }) => (
  <div>
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-2 gap-12 items-center">
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <PageHeader eyebrow={eyebrow} className="mb-8">
          {title}
        </PageHeader>
        {children}
      </div>
      <div aria-hidden="true" className="hidden lg:block rounded-3xl bg-tint p-8">
        <SeatIllustration />
        <p className="mt-2 text-center font-hand text-2xl text-brand -rotate-2">
          a purple chair is waiting for you
        </p>
      </div>
    </main>
  </div>
);

export default AuthLayout;
