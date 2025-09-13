export const TestimonialsSection = () => {
  // Placeholder for future testimonials
  const testimonials = [
    {
      name: "Скоро здесь появятся отзывы",
      company: "Клиенты и коллеги",
      text: "Здесь будут размещены отзывы о работе и проектах",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">ОТЗЫВЫ</span>{' '}
            <span className="text-gradient">КЛИЕНТОВ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Что говорят о моей работе
          </p>
        </div>

        {/* Testimonials Grid - Hidden for now */}
        <div className="hidden grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass rounded-2xl p-8 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center">
          <div className="glass rounded-2xl p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Раздел в разработке
            </h3>
            <p className="text-muted-foreground">
              Здесь скоро появятся отзывы клиентов и коллег о выполненных проектах. 
              Если вы работали со мной, буду рад получить ваш отзыв!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};