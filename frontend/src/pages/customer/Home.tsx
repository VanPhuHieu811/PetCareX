import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col py-4">
            {/* Hero Section */}
            <section className="min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white mx-4 my-4 rounded-3xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                    Chăm sóc thú cưng toàn diện
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-blue-100 mb-8">
                    Đặt lịch khám, tiêm phòng và mua sắm phụ kiện chất lượng cao cho thú cưng của bạn chỉ với vài cú click.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/customer/booking"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                    >
                        Đặt lịch ngay
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        to="/customer/products"
                        className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-600 transition-colors"
                    >
                        Mua sắm
                    </Link>
                </div>
            </section>
        </div>
    );
}
