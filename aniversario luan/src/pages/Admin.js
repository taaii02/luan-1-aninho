
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Guest } from "@/entities/Guest";
import { Timeline } from "@/entities/Timeline";
import { Photo } from "@/entities/Photo";
import { PartyInfo } from "@/entities/PartyInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Lock, UserCheck, Clock, Camera, Info, Check, X, Trash2, Edit, Eye, Users, Image } from "lucide-react";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // States for each section
  const [guests, setGuests] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);
  const [unapprovedPhotos, setUnapprovedPhotos] = useState([]);
  const [approvedPhotos, setApprovedPhotos] = useState([]);
  const [partyInfo, setPartyInfo] = useState(null);

  const loadAllData = useCallback(async () => {
    setGuests(await Guest.list("-created_date"));
    setTimelineItems(await Timeline.list("order"));
    setUnapprovedPhotos(await Photo.filter({ approved: false }, "-created_date"));
    setApprovedPhotos(await Photo.filter({ approved: true }, "-created_date"));
    const info = await PartyInfo.list();
    if (info.length > 0) setPartyInfo(info[0]);
  }, []); // Dependencies are empty because these setters and static methods don't change

  const checkAdmin = useCallback(async () => {
    try {
      const user = await User.me();
      if (user.role === 'admin') {
        setIsAdmin(true);
        await loadAllData(); // Use await here
      } else {
        setShowLogin(true);
      }
    } catch (e) {
      setShowLogin(true);
    } finally {
      setLoading(false);
    }
  }, [loadAllData]); // Dependency array includes loadAllData

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]); // Dependency array includes checkAdmin

  const handlePasswordLogin = () => {
    if (password === "adm456") {
      setIsAdmin(true);
      setShowLogin(false);
      loadAllData();
    } else {
      alert("Senha incorreta!");
    }
  };
  
  const handlePartyInfoChange = (field, value) => {
    setPartyInfo(prev => ({...prev, [field]: value}));
  };

  const savePartyInfo = async () => {
    try {
      if(partyInfo.id) {
        await PartyInfo.update(partyInfo.id, partyInfo);
      } else {
        await PartyInfo.create(partyInfo);
      }
      alert("✅ Informações da festa salvas!");
    } catch (error) {
      alert("❌ Erro ao salvar informações!");
    }
  };
  
  const approvePhoto = async (id) => {
    try {
      await Photo.update(id, {approved: true});
      loadAllData();
    } catch (error) {
      alert("❌ Erro ao aprovar foto!");
    }
  };

  const deletePhoto = async (id) => {
    if (confirm("❗ Tem certeza que deseja deletar esta foto?")) {
      try {
        await Photo.delete(id);
        loadAllData();
      } catch (error) {
        alert("❌ Erro ao deletar foto!");
      }
    }
  };
  
  const deleteTimelineItem = async (id) => {
    if (confirm("❗ Tem certeza que deseja deletar este item da linha do tempo?")) {
      try {
        await Timeline.delete(id);
        loadAllData();
      } catch (error) {
        alert("❌ Erro ao deletar item!");
      }
    }
  };

  const deleteGuest = async (id) => {
    if (confirm("❗ Tem certeza que deseja deletar esta confirmação?")) {
      try {
        await Guest.delete(id);
        loadAllData();
      } catch (error) {
        alert("❌ Erro ao deletar confirmação!");
      }
    }
  };

  const confirmedGuests = guests.filter(g => g.will_attend);
  const totalAdults = confirmedGuests.reduce((sum, g) => sum + (g.adults_count || 0), 0);
  const totalChildren = confirmedGuests.reduce((sum, g) => sum + (g.children_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-6xl">🍎</motion.div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto mb-4 w-16 h-16 text-orange-500" />
            <CardTitle className="text-2xl text-gray-800">Acesso Administrativo</CardTitle>
            <p className="text-gray-600">Digite a senha para continuar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordLogin()}
                className="text-lg"
                placeholder="Digite a senha..."
              />
            </div>
            <Button onClick={handlePasswordLogin} className="w-full fruit-button text-lg py-3">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center p-8">
          <Lock className="mx-auto mb-4 w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Esta página é apenas para administradores.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header com estatísticas */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
          🎉 Painel da Festa do Luan
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Card className="text-center p-4">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{confirmedGuests.length}</p>
            <p className="text-sm text-gray-600">Confirmados</p>
          </Card>
          <Card className="text-center p-4">
            <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{totalAdults}</p>
            <p className="text-sm text-gray-600">Adultos</p>
          </Card>
          <Card className="text-center p-4">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-600">{totalChildren}</p>
            <p className="text-sm text-gray-600">Crianças</p>
          </Card>
          <Card className="text-center p-4">
            <Camera className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <p className="text-2xl font-bold text-pink-600">{approvedPhotos.length}</p>
            <p className="text-sm text-gray-600">Fotos</p>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="guests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="guests" className="flex flex-col gap-1 py-3">
            <UserCheck className="w-6 h-6" />
            <span className="text-xs">Convidados</span>
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex flex-col gap-1 py-3">
            <Camera className="w-6 h-6" />
            <span className="text-xs">Fotos</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex flex-col gap-1 py-3">
            <Clock className="w-6 h-6" />
            <span className="text-xs">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="partyInfo" className="flex flex-col gap-1 py-3">
            <Info className="w-6 h-6" />
            <span className="text-xs">Festa</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-6 h-6" />
                Confirmações ({guests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guests.map(guest => (
                  <Card key={guest.id} className="p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{guest.name}</h3>
                          {guest.will_attend ? 
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> : 
                            <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                          }
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {guest.email && <p>📧 {guest.email}</p>}
                          {guest.phone && <p>📱 {guest.phone}</p>}
                          {guest.will_attend && (
                            <p>👥 {guest.adults_count} adultos, {guest.children_count} crianças</p>
                          )}
                          {guest.message && (
                            <p className="bg-gray-100 p-2 rounded text-xs italic">
                              "{guest.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteGuest(guest.id)}
                        variant="destructive"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {guests.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Nenhuma confirmação ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <div className="space-y-6">
            {/* Fotos para aprovar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-500" />
                  Fotos para Aprovar ({unapprovedPhotos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unapprovedPhotos.map(photo => (
                    <Card key={photo.id} className="overflow-hidden">
                      <img src={photo.photo_url} className="w-full h-48 object-cover" alt={photo.caption} />
                      <div className="p-4">
                        <p className="font-medium mb-1">{photo.caption}</p>
                        <p className="text-sm text-gray-500 mb-3">Por: {photo.guest_name}</p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => approvePhoto(photo.id)} className="flex-1">
                            <Check className="w-4 h-4 mr-1" />Aprovar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deletePhoto(photo.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {unapprovedPhotos.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      ✅ Todas as fotos foram revisadas!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fotos aprovadas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-6 h-6 text-green-500" />
                  Fotos Aprovadas ({approvedPhotos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {approvedPhotos.map(photo => (
                    <Card key={photo.id} className="overflow-hidden">
                      <img src={photo.photo_url} className="w-full h-32 object-cover" alt={photo.caption} />
                      <div className="p-3">
                        <p className="text-sm font-medium truncate">{photo.caption}</p>
                        <p className="text-xs text-gray-500 mb-2">{photo.guest_name}</p>
                        <Button size="sm" variant="destructive" onClick={() => deletePhoto(photo.id)} className="w-full">
                          <Trash2 className="w-3 h-3 mr-1" />Deletar
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {approvedPhotos.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      Nenhuma foto aprovada ainda
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Linha do Tempo ({timelineItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timelineItems.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                            {item.order}º
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {item.age_months} meses
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteTimelineItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {timelineItems.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum item na linha do tempo
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partyInfo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-6 h-6" />
                Informações da Festa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {partyInfo && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="event_name">Nome do Evento</Label>
                    <Input
                      id="event_name"
                      value={partyInfo.event_name || ''}
                      onChange={(e) => handlePartyInfoChange('event_name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={partyInfo.date || ''}
                        onChange={(e) => handlePartyInfoChange('date', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        value={partyInfo.time || ''}
                        onChange={(e) => handlePartyInfoChange('time', e.target.value)}
                        className="mt-1"
                        placeholder="15:00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location_name">Nome do Local</Label>
                    <Input
                      id="location_name"
                      value={partyInfo.location_name || ''}
                      onChange={(e) => handlePartyInfoChange('location_name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      value={partyInfo.address || ''}
                      onChange={(e) => handlePartyInfoChange('address', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="additional_info">Informações Adicionais</Label>
                    <Textarea
                      id="additional_info"
                      value={partyInfo.additional_info || ''}
                      onChange={(e) => handlePartyInfoChange('additional_info', e.target.value)}
                      className="mt-1 h-24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="map_embed">Embed do Mapa (HTML)</Label>
                    <Textarea
                      id="map_embed"
                      value={partyInfo.map_embed || ''}
                      onChange={(e) => handlePartyInfoChange('map_embed', e.target.value)}
                      className="mt-1 h-32"
                      placeholder="<iframe src='...'></iframe>"
                    />
                  </div>
                  <Button onClick={savePartyInfo} className="w-full fruit-button text-lg py-3">
                    💾 Salvar Informações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
