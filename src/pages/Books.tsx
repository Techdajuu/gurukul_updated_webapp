import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookListing from '@/components/BookListing';

const Books = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Browse Books</h1>
            <p className="text-lg text-blue-100">
              Find the perfect books for your studies from verified sellers
            </p>
          </div>
        </div>
        <BookListing />
      </main>
      <Footer />
    </div>
  );
};

export default Books;