export const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-foreground">ОБО</span>{' '}
                <span className="text-gradient">МНЕ</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Мне 16 лет, и я занимаюсь разработкой программного обеспечения, 
                уделяя особое внимание AI и веб-технологиям. Моя цель — создавать 
                продукты, которые решают реальные задачи и приносят пользу.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Начал программировать в 14 лет, с тех пор постоянно изучаю новые 
                технологии и применяю их в практических проектах. Особенно увлечен 
                возможностями искусственного интеллекта и его интеграцией в веб-приложения.
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Фокус на AI и машинном обучении</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Полный цикл веб-разработки</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Постоянное обучение новым технологиям</span>
              </div>
            </div>
          </div>

          {/* Right Content - Photo Placeholder */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Photo Container */}
              <div className="glass rounded-2xl p-6">
                <div className="aspect-square bg-gradient-primary rounded-xl flex items-center justify-center">
                  <div className="text-6xl font-bold text-white">Н</div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 glass rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-accent rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 glass rounded-lg flex items-center justify-center rotate-12">
                <div className="w-6 h-6 bg-gradient-secondary rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};