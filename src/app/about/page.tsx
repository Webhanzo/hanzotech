import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
           <div className="order-last md:order-first">
             <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
              عن HANZO
            </h1>
            <h2 className="mt-4 font-headline text-2xl font-semibold md:text-3xl">
              تقنيتك بلمسة تميّز وسرعة لا تُضاهى
            </h2>
            <div className="prose prose-lg mt-6 max-w-full text-muted-foreground">
              <p>
                في عالمٍ تسوده السرعة والابتكار، تبرز Hanzo كشريكك المثالي في عالم التقنية، حيث نُقدّم لك أحدث أجهزة اللابتوب والهواتف الذكية التي تجمع بين الجودة الفريدة والأداء الاستثنائي. سواء كنتَ رائد أعمال طموحًا، أو أسرة تبحث عن الموثوقية، أو شابًّا يطمح إلى التميز، فإن Hanzo تُصمم تجربتك التقنية لتكون أسرع، أذكى، وأكثر تنافسية.
              </p>
              <strong>لماذا Hanzo؟</strong>
              <ul>
                <li>🛍️ تشكيلة مُختارة بعناية: نختار لكم أجهزة تتميز بتكنولوجيا متطورة تُلاحق المستقبل.</li>
                <li>⚡ توصيل فائق السرعة: لا تنتظر طويلًا! خدمتنا توصلكم بمنتجاتكم في الوقت الذي يناسبكم.</li>
                <li>💰 أسعار تنافسية: جودة عالية بأسعار تُناسب الجميع، من الشركات الناشئة إلى الأسر والموظفين الطموحين.</li>
                <li>🔧 جودة غير مألوفة: نضمن لكم منتجاتٍ تدوم، لأن رضاكم هو أولويتنا.</li>
              </ul>
               <strong>لا تُضيّع الفرصة!</strong>
              <p>
                انضم إلى آلاف العملاء الذين اختاروا Hanzo ليكونوا في الصدارة. تصفّح تشكيلتنا اليوم عبر موقعنا، أو تواصل معنا لمعرفة العروض الحصرية.
              </p>
               <p className="font-headline text-lg font-semibold text-foreground">Hanzo — حيث التميّز التقني يلتقي باحتياجاتك!</p>
            </div>
           </div>
           <div>
            <Image
                src="https://placehold.co/600x700/1d3557/ffffff?text=About+Us"
                alt="فريق هانزو"
                width={600}
                height={700}
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint="team work"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
