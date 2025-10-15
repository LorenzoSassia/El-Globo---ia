
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onIngresarClick: () => void;
}

const imagenesCarrusel = [
  {
    src: 'https://placehold.co/1200x500/0284c7/FFFFFF/png?text=Natación',
    alt: 'Clases de natación',
    title: 'Aprendé a Nadar con Nosotros',
    subtitle: 'Piletas climatizadas y profesores expertos para todas las edades.',
  },
  {
    src: 'https://placehold.co/1200x500/166534/FFFFFF/png?text=Gimnasio',
    alt: 'Gimnasio del club',
    title: 'Equipamiento de Última Generación',
    subtitle: 'Entrená en nuestro gimnasio completo con máquinas modernas y peso libre.',
  },
  {
    src: 'https://placehold.co/1200x500/be123c/FFFFFF/png?text=Tenis',
    alt: 'Canchas de tenis',
    title: 'Jugá al Tenis Todo el Año',
    subtitle: 'Disponemos de canchas de polvo de ladrillo cubiertas y al aire libre.',
  },
   {
    src: 'https://placehold.co/1200x500/581c87/FFFFFF/png?text=Yoga',
    alt: 'Clases de Yoga',
    title: 'Encontrá tu Equilibrio',
    subtitle: 'Sumate a nuestras clases de Yoga y Pilates para relajar cuerpo y mente.',
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onIngresarClick }) => {
    const [indiceActual, setIndiceActual] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIndiceActual((prevIndex) => (prevIndex + 1) % imagenesCarrusel.length);
        }, 5000);
        return () => clearTimeout(timer);
    }, [indiceActual]);

    const irAImagen = (indice: number) => {
        setIndiceActual(indice);
    };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
        <nav className="container flex items-center justify-between p-4 mx-auto">
          <h1 className="text-2xl font-bold">Club El Globo</h1>
          <button
            onClick={onIngresarClick}
            className="px-5 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Ingresar
          </button>
        </nav>
      </header>

      <main>
        {/* Hero Carousel */}
        <section className="relative w-full h-[500px] overflow-hidden">
            <div className="w-full h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${indiceActual * 100}%)` }}>
                {imagenesCarrusel.map((img, index) => (
                     <div key={index} className="absolute top-0 left-0 w-full h-full">
                         <img src={img.src.replace(`${index * 100}%`, `${index * 100}%`)} alt={img.alt} className="object-cover w-full h-full" />
                         <div className="absolute inset-0 bg-black opacity-60"></div>
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                             <h2 className="text-4xl font-bold md:text-6xl">{img.title}</h2>
                             <p className="mt-4 text-lg md:text-xl max-w-2xl">{img.subtitle}</p>
                         </div>
                     </div>
                ))}
            </div>
            <div className="absolute z-10 flex space-x-3 bottom-5 left-1/2 -translate-x-1/2">
                {imagenesCarrusel.map((_, index) => (
                    <button key={index} onClick={() => irAImagen(index)} className={`w-3 h-3 rounded-full ${indiceActual === index ? 'bg-white' : 'bg-gray-500'}`}></button>
                ))}
            </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-800">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">Un Lugar para la Familia y el Deporte</h2>
            <p className="max-w-3xl mx-auto text-gray-400">
              Desde 1925, el Club El Globo es el corazón deportivo y social de Rosario. Ofrecemos instalaciones de primer nivel,
              un ambiente amigable y una amplia variedad de actividades para que cada miembro de la familia encuentre su pasión.
            </p>
          </div>
        </section>

        {/* Activities Section */}
        <section className="container px-4 py-20 mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center">Nuestras Actividades</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                 <div className="p-6 text-center bg-gray-800 rounded-lg">
                    <h3 className="mb-2 text-xl font-semibold text-blue-400">Deportes</h3>
                    <p className="text-gray-400">Natación, Tenis, Fútbol, Básquet, Gimnasia Artística y más.</p>
                </div>
                 <div className="p-6 text-center bg-gray-800 rounded-lg">
                    <h3 className="mb-2 text-xl font-semibold text-green-400">Fitness y Bienestar</h3>
                    <p className="text-gray-400">Gimnasio de musculación, clases de Yoga, Pilates y Zumba.</p>
                </div>
                <div className="p-6 text-center bg-gray-800 rounded-lg">
                    <h3 className="mb-2 text-xl font-semibold text-yellow-400">Área Social</h3>
                    <p className="text-gray-400">Restaurante, quincho con parrilleros y salón de eventos.</p>
                </div>
                <div className="p-6 text-center bg-gray-800 rounded-lg">
                    <h3 className="mb-2 text-xl font-semibold text-red-400">Escuela Deportiva</h3>
                    <p className="text-gray-400">Formación para niños y jóvenes en todas nuestras disciplinas.</p>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Club El Globo. Todos los derechos reservados.</p>
          <p className="mt-1 text-sm">Rosario, Argentina</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
