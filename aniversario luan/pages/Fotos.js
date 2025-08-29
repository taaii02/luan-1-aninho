import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Photo as PhotoEntity } from "@/entities/Photo";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Download, Heart, Image as ImageIcon, X } from "lucide-react";

const PhotoCard = ({ photo, onSelect }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.5 }}
    className="break-inside-avoid"
  >
    <Card 
      className="bg-white/95 backdrop-blur-md fruit-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(photo)}
    >
      <img src={photo.photo_url} alt={photo.caption || 'Foto da festa'} className="w-full" />
      <CardContent className="p-4">
        <p className="font-semibold text-gray-700">{photo.caption}</p>
        <p className="text-sm text-gray-500">Postado por: {photo.guest_name}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Fotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    const data = await PhotoEntity.filter({ approved: true }, "-created_date");
    setPhotos(data);
    setLoading(false);
  };
  
  const PhotoUploadForm = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({ name: '', caption: '' });
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !formData.name) {
            alert("Por favor, preencha seu nome e selecione uma foto.");
            return;
        }

        setIsUploading(true);
        try {
            const { file_url } = await UploadFile({ file });
            await PhotoEntity.create({
                guest_name: formData.name,
                caption: formData.caption,
                photo_url: file_url,
                approved: false
            });
            setShowUpload(false);
            alert("Foto enviada com sucesso! Ela aparecerá na galeria após aprovação.");
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar a foto. Tente novamente.");
        }
        setIsUploading(false);
    };

    return (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Card className="bg-white/95 backdrop-blur-md fruit-shadow">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span className="text-xl text-green-600">Compartilhe um momento!</span>
                        <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)}><X/></Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Seu nome *</Label>
                            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                            <Label htmlFor="caption">Legenda</Label>
                            <Textarea id="caption" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} />
                        </div>
                        <div>
                            <Label htmlFor="photo">Foto *</Label>
                            <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} required />
                        </div>
                        <Button type="submit" disabled={isUploading} className="w-full fruit-button">
                            {isUploading ? "Enviando..." : "Enviar Foto"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Galeria de Fotos
          </h1>
          <p className="text-lg text-gray-600">
            Veja os melhores momentos da festa e compartilhe os seus!
          </p>
          <div className="flex justify-center gap-2 text-3xl mt-4">
            📸 🖼️ ❤️ 🎉
          </div>
        </motion.div>
        
        <div className="text-center mb-8">
            {!showUpload && 
                <Button className="fruit-button px-8 py-4 text-lg rounded-2xl" onClick={() => setShowUpload(true)}>
                    <Upload className="w-5 h-5 mr-2" />
                    Enviar sua foto
                </Button>
            }
            {showUpload && <PhotoUploadForm />}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-6xl">🍌</motion.div>
          </div>
        ) : photos.length === 0 ? (
          <Card className="text-center p-8 bg-white/90"><p>Nenhuma foto foi adicionada ainda. Seja o primeiro!</p></Card>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {photos.map(photo => (
                  <PhotoCard key={photo.id} photo={photo} onSelect={setSelectedPhoto} />
              ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedPhoto(null)}
            >
                <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="relative max-w-4xl max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                >
                    <img src={selectedPhoto.photo_url} alt={selectedPhoto.caption} className="w-auto h-auto max-w-full max-h-[80vh] rounded-lg"/>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white rounded-b-lg">
                        <p className="font-bold">{selectedPhoto.caption}</p>
                        <p className="text-sm">Por: {selectedPhoto.guest_name}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70" onClick={() => setSelectedPhoto(null)}><X/></Button>
                    <a href={selectedPhoto.photo_url} download target="_blank" rel="noopener noreferrer">
                      <Button className="absolute bottom-2 right-2 fruit-button">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                    </a>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}