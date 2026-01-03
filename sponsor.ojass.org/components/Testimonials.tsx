"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      company: "Coca-Cola India",
      logo: "/Sponser/cocaCola.webp",
      quote: "OJASS provided an incredible platform to connect with young, dynamic students. The energy and enthusiasm of the participants perfectly aligned with our brand values. The event's scale and organization were truly impressive.",
      author: "Aanchal Chauhan",
      position: "Brand Marketing Manager",
      rating: 5,
    },
    {
      company: "Tata Steel",
      logo: "/Sponser/tataSteel.webp",
      quote: "As a Jharkhand-based company, partnering with NIT Jamshedpur's OJASS was a natural fit. The quality of talent and innovation showcased at the fest reinforced our commitment to nurturing the region's brightest minds. Outstanding collaboration.",
      author: "Vibhore Goel",
      position: "Head of Campus Engagement",
      rating: 5,
    },
    {
      company: "GeeksforGeeks",
      logo: "/Sponser/gfg.webp",
      quote: "OJASS delivered exceptional ROI for our brand. We engaged with thousands of passionate coders and tech enthusiasts, resulting in significant growth in course enrollments and platform engagement. The event's tech-focused audience was exactly our target demographic.",
      author: "Anshika Gupta",
      position: "Growth & Partnerships Lead",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-blue-600">Sponsors Say</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from brands who&apos;ve experienced the OJASS impact firsthand
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Company Logo */}
              <div className="mb-4 h-12 flex items-center">
                <img
                  src={testimonial.logo}
                  alt={testimonial.company}
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-gray-100">
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
                <p className="text-sm text-blue-600 font-semibold">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600">Brands Partnered</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
              <p className="text-gray-600">Average Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">Return Sponsors</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

