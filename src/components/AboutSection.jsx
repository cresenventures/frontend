import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Award, Layers, CheckCircle } from 'lucide-react';

const aboutCards = [
	{
		icon: <Globe className="w-8 h-8 text-primary mb-2" />,
		title: 'Our Products & Applications',
		content: (
			<>
				<p className="text-gray-700 mb-2">
					<span className="font-semibold text-primary">Thermal Paper Products:</span>
				</p>
				<ul className="list-disc list-inside text-gray-700 ml-2 mb-2 text-sm md:text-base">
					<li>Thermal Paper Rolls (57mm, 80mm, and custom specifications)</li>
					<li>Jumbo Thermal Paper Rolls for converters and wholesale buyers</li>
					<li>ATM and Kiosk Paper Rolls</li>
					<li>Label-Grade Thermal Paper for barcode and logistics printing</li>
					<li>BPA-Free and Eco-Friendly Paper Options</li>
					<li>Custom slitting, core sizes, and private-label packaging</li>
				</ul>
				<p className="text-gray-700 mb-2 mt-2">
					<span className="font-semibold text-primary">Applications:</span>
				</p>
				<ul className="list-disc list-inside text-gray-700 ml-2 mb-2 text-sm md:text-base">
					<li>Retail & POS: Billing and transaction receipts in stores, restaurants, and fuel stations</li>
					<li>Banking & Financial Services: ATM receipts, audit logs, and transaction records</li>
					<li>Healthcare: Diagnostic equipment, patient labeling, and pharmacy systems</li>
					<li>Logistics & Warehousing: Barcode labels, shipment tracking, and packaging</li>
					<li>Transport & Ticketing: Receipts for parking, toll booths, and travel systems</li>
					<li>Industrial Printing: OEM thermal paper for embedded printer applications</li>
				</ul>
				<p className="text-gray-700 text-xs md:text-base">
					<span className="font-semibold">All our thermal paper products</span> are produced with strict quality controls and advanced coating technology to ensure durability, smooth performance, and excellent image resolution.
				</p>
			</>
		),
	},
	{
		icon: <Award className="w-8 h-8 text-amber-500 mb-2" />,
		title: 'Why Cresen Ventures and Innovations',
		content: (
			<ul className="list-disc list-inside text-gray-700 ml-2 mb-2 text-sm md:text-base">
				<li>High-quality manufacturing and certified engineering practices</li>
				<li>Global supply capabilities</li>
				<li>Reliable delivery, customization, and after-sales support</li>
				<li>Commitment to sustainability, efficiency, and customer satisfaction</li>
			</ul>
		),
	},
	{
		icon: <Layers className="w-8 h-8 text-primary mb-2" />,
		title: 'Company Overview',
		content: (
			<p className="text-gray-700 text-sm md:text-base">
				Our thermal paper division produces a wide range of rolls and jumbo reels engineered for sharp print quality, smooth performance, and compatibility with all major printing systems. With stringent quality control and flexible customization, we ensure consistent value for our partners.<br /><br />
				Driven by innovation, quality, and customer focus, Cresen Ventures and Innovations is your trusted partner for dependable supply and sustainable growth.
			</p>
		),
	},
];

const AboutSection = () => {
	return (
		<section
			id="about"
			aria-labelledby="about-heading"
			className="relative py-28 bg-white overflow-hidden"
		>
			<div className="absolute inset-0 z-0" aria-hidden="true" />
			<div className="container mx-auto px-6 relative z-10">
				<div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
					{/* Image left on desktop, top on mobile */}
					<div className="order-2 lg:order-1 animate-on-scroll flex justify-center">
						<motion.img
							initial={{ opacity: 0, scale: 0.96 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.7, ease: 'easeOut' }}
							className="rounded-2xl shadow-2xl w-full max-w-lg object-cover border-4 border-white"
							alt="Bulk thermal paper rolls and packaging"
							src="/boxandrolls.jpg"
						/>
					</div>
					{/* Vision & Mission */}
					<div className="order-1 lg:order-2 animate-on-scroll flex flex-col gap-8">
						<h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
							About <span className="text-primary">Cresen Ventures</span>
						</h2>
						<p className="text-lg md:text-2xl text-gray-700 font-medium mb-2">
							Cresen Ventures and Innovations is a dynamic company specializing in thermal paper manufacturing. We serve global clients across retail, banking, logistics, healthcare, and industrial sectors with high-quality products and reliable services.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							<div className="bg-gradient-to-br from-primary/10 to-white p-6 rounded-xl border border-primary/20 shadow flex flex-col items-center text-center">
								<Zap className="w-8 h-8 text-primary mb-2" />
								<h3 className="text-lg font-bold text-primary mb-1">Our Vision</h3>
								<p className="text-gray-700 text-base">
									To be a globally recognized and trusted partner in thermal paper manufacturing, delivering innovative, reliable, and sustainable products and services that empower industries and support a cleaner, more efficient future.
								</p>
							</div>
							<div className="bg-gradient-to-br from-green-100 to-white p-6 rounded-xl border border-green-200 shadow flex flex-col items-center text-center">
								<CheckCircle className="w-8 h-8 text-green-500 mb-2" />
								<h3 className="text-lg font-bold text-primary mb-1">Our Mission</h3>
								<p className="text-gray-700 text-base">
									Our mission is to provide high-quality thermal paper products that exceed customer expectations in performance, reliability, and value.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Main content paragraphs below image and boxes - now full width */}
				<div className="w-full mt-16 px-2 md:px-0">
					<h3 className="text-2xl font-bold text-primary mt-8 mb-2">Product Portfolio & Applications</h3>
					<p className="text-gray-700 mb-8 text-base md:text-lg">
						We offer a comprehensive range of premium thermal paper solutions for diverse business needs, including Thermal Paper Rolls (57mm, 80mm, and custom sizes), Jumbo Rolls for converters and wholesale, ATM & Kiosk Paper Rolls, Label-Grade Paper for barcodes and logistics, BPA-Free & Eco-Friendly Options, and custom slitting, core sizes, and private-label packaging. Our products are widely used in retail and POS (receipts for stores, restaurants, and fuel stations), banking (ATM receipts, audit logs, transaction records), healthcare (diagnostic equipment, patient labeling), logistics (barcode labels, shipment tracking), transport (parking, toll, and travel receipts), and industrial applications (OEM thermal paper for embedded printers). All our thermal paper products are manufactured with advanced coating technology and strict quality controls for durability, smooth performance, and excellent image resolution.
					</p>
					<h3 className="text-2xl font-bold text-primary mt-12 mb-2">Why Partner with Cresen Ventures</h3>
					<p className="text-gray-700 mb-8 text-base md:text-lg">
						We deliver value through certified manufacturing and engineering standards, global supply capabilities and scalable solutions, reliable delivery, customization, and after-sales support, and a strong commitment to sustainability, efficiency, and client satisfaction.
					</p>
					<h3 className="text-2xl font-bold text-primary mt-12 mb-2">Company Overview</h3>
					<p className="text-gray-700 mb-8 text-base md:text-lg">
						Our thermal paper division delivers a wide range of rolls and jumbo reels engineered for sharp print quality, smooth performance, and compatibility with all major printing systems. Stringent quality control and flexible customization ensure lasting value for our partners. Driven by innovation, quality, and customer focus, Cresen Ventures and Innovations is committed to dependable supply and long-term business relationships.
					</p>
				</div>

				<div className="mt-12 text-center text-xs text-gray-400">
					<span>From powering transactions to powering the future, Cresen Ventures and Innovations is your dependable partner for thermal paper solutions worldwide.</span>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;