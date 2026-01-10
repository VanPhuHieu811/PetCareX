import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ShoppingBag, Activity, Shield, Users, Star } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">

            {/* 1. Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white pt-16 pb-20 lg:pt-32 lg:pb-32">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                        {/* Text Content */}
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-200 bg-white/60 backdrop-blur-sm text-blue-700 text-sm font-semibold tracking-wide shadow-sm mb-8 hover:scale-105 transition-transform cursor-default">
                                <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                                Hệ thống chăm sóc thú cưng hàng đầu
                            </div>
                            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl mb-6 leading-tight">
                                <span className="block">Chăm sóc thú cưng</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    toàn diện & tận tâm
                                </span>
                            </h1>
                            <p className="mt-4 text-lg text-slate-600 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                                Đặt lịch khám, tiêm phòng và mua sắm đồ dùng chất lượng cao cho người bạn bốn chân. Đội ngũ bác sĩ chuyên nghiệp sẵn sàng hỗ trợ 24/7.
                            </p>
                            <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                                <Link
                                    to="/customer/booking"
                                    className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Đặt lịch ngay
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    to="/customer/products"
                                    className="flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-300"
                                >
                                    Mua sắm
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="mt-16 lg:mt-0 lg:col-span-6">
                            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                                <div className="relative block w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <img
                                        className="w-full h-full object-cover"
                                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                        alt="Happy dog running"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                </div>
                                {/* Floating decorative card */}
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Shield className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">100% An toàn</div>
                                        <div className="text-xs text-gray-500">Đã kiểm định</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Stats Bar */}
            <section className="bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {[
                            { label: 'Khách hàng', value: '2k+', icon: Users, color: 'text-blue-500' },
                            { label: 'Bác sĩ', value: '50+', icon: Activity, color: 'text-rose-500' },
                            { label: 'Sản phẩm', value: '100%', icon: Shield, color: 'text-green-500' },
                            { label: 'Kinh nghiệm', value: '10 Năm', icon: Calendar, color: 'text-amber-500' },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center justify-center text-center group">
                                <div className={`mb-2 p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <dd className="text-3xl font-extrabold text-gray-900">{stat.value}</dd>
                                <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{stat.label}</dt>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Dịch vụ</h2>
                        <h3 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Giải pháp toàn diện cho thú cưng
                        </h3>
                        <p className="mt-4 text-lg text-gray-500">
                            Tất cả những gì thú cưng của bạn cần, từ sức khỏe đến làm đẹp, đều có tại PetCareX.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                        {[
                            {
                                title: 'Đặt lịch khám',
                                description: 'Đặt hẹn trước với các bác sĩ thú y hàng đầu. Tiết kiệm thời gian, không phải chờ đợi.',
                                icon: Calendar,
                                link: '/customer/booking',
                                color: 'bg-indigo-500',
                                shadow: 'hover:shadow-indigo-500/20'
                            },
                            {
                                title: 'Cửa hàng Pet Shop',
                                description: 'Thức ăn, phụ kiện, thuốc men chính hãng, đa dạng. Giao hàng tận nơi nhanh chóng.',
                                icon: ShoppingBag,
                                link: '/customer/products',
                                color: 'bg-emerald-500',
                                shadow: 'hover:shadow-emerald-500/20'
                            },
                            {
                                title: 'Hồ sơ sức khỏe',
                                description: 'Lưu trữ lịch sử khám bệnh, tiêm phòng trực tuyến. Dễ dàng theo dõi sức khỏe thú cưng.',
                                icon: Activity,
                                link: '/customer/profile',
                                color: 'bg-rose-500',
                                shadow: 'hover:shadow-rose-500/20'
                            },
                        ].map((feature) => (
                            <Link key={feature.title} to={feature.link} className="block group">
                                <div className={`h-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${feature.shadow}`}>
                                    <div className={`inline-flex items-center justify-center p-3 rounded-xl shadow-lg ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed mb-6">
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                                        Khám phá ngay <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
