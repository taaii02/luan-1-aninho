import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timeline as TimelineEntity } from "@/entities/Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Gift } from "lucide-react";

const TimelineItem = ({ item, isLeft }) => {
  const alignmentClass = isLeft ? "md:text-right" : "md:text-left";
  const contentOrderClass = isLeft ? "md:order-1" : "";
  const cardAnimation = {
    initial: { x: isLeft ? -100 : 100, opacity: 0 },
    whileInView: { x: 0, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="md:grid md:grid-cols-2 md:gap-x-12 relative">
      <div className={`flex items-center justify-center absolute md:relative top-0 left-1/2 -ml-3 md:ml-0 md:left-auto md:top-auto h-full ${contentOrderClass}`}>
        <div className="h-full w-0.5 bg-orange-200"></div>
        <div className="absolute top-1/2 -mt-3 w-6 h-6 rounded-full bg-orange-400 border-4 border-white"></div>
      </div>
      <motion.div {...cardAnimation} className="mb-8 md:mb-0">
        <Card className="bg-white/95 backdrop-blur-md fruit-shadow">
          <CardHeader className={alignmentClass}>
            <p className="text-orange-500 font-semibold">{item.age_months} meses</p>
            <CardTitle className="text-xl text-gray-800">{item.title}</CardTitle>
            <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
          </CardHeader>
          <CardContent className={alignmentClass}>
            {item.photo_url && (
              <img src={item.photo_url} alt={item.title} className="rounded-lg mb-4 w-full" />
            )}
            <p className="text-gray-600">{item.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default function LinhaTempo() {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimeline = async () => {
      const data = await TimelineEntity.list("order");
      setTimelineItems(data);
      setLoading(false);
    };
    loadTimeline();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Linha do Tempo do Luan
          </h1>
          <p className="text-lg text-gray-600">
            Acompanhe o crescimento do nosso pequeno! ❤️
          </p>
          <div className="flex justify-center gap-2 text-3xl mt-4">
            👶 🍼 🧸 👣 🎉
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-6xl">🍎</motion.div>
          </div>
        ) : (
          <div className="relative">
            {timelineItems.map((item, index) => (
              <TimelineItem key={item.id} item={item} isLeft={index % 2 !== 0} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white">
            <Gift className="w-6 h-6" />
          </div>
          <p className="text-xl font-semibold text-green-700 mt-4">1 ano de muitas alegrias!</p>
        </motion.div>
      </div>
    </div>
  );
}