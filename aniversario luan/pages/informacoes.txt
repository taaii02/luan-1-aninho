
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyInfo } from "@/entities/PartyInfo";
import { Calendar, Clock, MapPin, Phone, Info, Navigation } from "lucide-react";

export default function Informacoes() {
  const [partyInfo, setPartyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartyInfo();
  }, []);

  const loadPartyInfo = async () => {
    const data = await PartyInfo.list();
    if (data.length > 0) {
      setPartyInfo(data[0]);
    }
    setLoading(false);
  };

  const handleNavigate = () => {
    if (partyInfo?.address) {
      const address = encodeURIComponent(partyInfo.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🍎
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Informações da Festa
          </h1>
          <div className="flex justify-center gap-2 text-3xl">
            🍎 🍌 🍓 🍊 🍍
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informações principais */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-white/95 backdrop-blur-md fruit-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-orange-600">
                  <Info className="w-7 h-7" />
                  Detalhes do Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Data</h3>
                    <p className="text-gray-600 text-lg">
                      {partyInfo ? new Date(partyInfo.date).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'A definir'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Horário</h3>
                    <p className="text-gray-600 text-lg">
                      {partyInfo?.time || 'A definir'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Local</h3>
                    <p className="text-gray-600 font-medium">
                      {partyInfo?.location_name || 'A definir'}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {partyInfo?.address || 'Endereço a definir'}
                    </p>
                    {partyInfo?.address && (
                      <button
                        onClick={handleNavigate}
                        className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Navigation className="w-4 h-4" />
                        Ver no Google Maps
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informações adicionais */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="bg-white/95 backdrop-blur-md fruit-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-green-600">
                  🎂 Sobre a Festa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Tema</h3>
                    <p className="text-gray-600">Frutas Divertidas 🍎🍌🍓</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Informações Especiais</h3>
                    <p className="text-gray-600">
                      Se o dia da festa estiver ensolarado, traga o seu chimarrão para aproveitarmos o espaço externo! Aahh, e não esqueça do protetor solar e repelente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mapa */}
            {partyInfo?.map_embed && (
              <Card className="bg-white/95 backdrop-blur-md fruit-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-blue-600">
                    <MapPin className="w-6 h-6" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="w-full h-64 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: partyInfo.map_embed }}
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Contato */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-200">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold text-orange-700 mb-4">
                Dúvidas? Entre em contato!
              </h3>
              <p className="text-lg text-orange-600 mb-6">
                Estamos ansiosos para celebrar com vocês! 🎉
              </p>
              <a 
                href="https://wa.me/5554991656068" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/>
                </svg>
                (55) 54 99165-6068
              </a>
              <div className="flex justify-center gap-2 text-4xl mt-6">
                <motion.span animate={{ bounce: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}>🎈</motion.span>
                <motion.span animate={{ bounce: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>🎂</motion.span>
                <motion.span animate={{ bounce: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>🎁</motion.span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
