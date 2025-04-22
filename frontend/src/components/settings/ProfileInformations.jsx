import { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  Briefcase,
  Calendar,
  Edit,
  Edit3,
  Mail,
  User,
  MapPin,
  Building,
  Globe,
  Map,
  Hash,
  Instagram,
  Facebook,
  MailIcon as Gmail,
} from "lucide-react"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { modifierUser } from "../../lib/api"
import CustomToast from "../CustomToast"

const ProfileInformations = ({ user }) => {
  console.log("User from parametre : ", user)
  const [isEnabled, setIsenabled] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormdata] = useState({
    userId: user._id,
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
    addresses: user.addresses?.length ? user.addresses : [{
      street: "",
      city: "",
      state: "",
      country: "Maroc",
      postalCode: "",
      isDefault: true
    }],
    socialMedia: {
      instagram: user.socialMedia?.instagram || "",
      facebook: user.socialMedia?.facebook || "",
      google: user.socialMedia?.google || ""
    }
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // You would typically upload this to a file storage service
      // and get back a URL to store in your database
      const imageUrl = await uploadImage(file); // Implement this function
      setFormdata(prev => ({ ...prev, avatar: imageUrl }));
      setSelectedImage(file);
    }
  };
  const handleChange = (name, value, isAddress = false, index = 0) => {
    if (isAddress) {
      setFormdata(prevData => {
        const newAddresses = [...prevData.addresses];
        newAddresses[index] = {
          ...newAddresses[index],
          [name]: value
        };
        return {
          ...prevData,
          addresses: newAddresses
        };
      });
    } else if (name.startsWith('socialMedia.')) {
      const socialMediaField = name.split('.')[1];
      setFormdata(prevData => ({
        ...prevData,
        socialMedia: {
          ...prevData.socialMedia,
          [socialMediaField]: value
        }
      }));
    } else {
      setFormdata(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await modifierUser(formData);
      console.log("res : ", res.data);
      CustomToast("success", res.data.message || "Thanks for editing your profile")
    } catch (error) {
      console.log("error", error)
      CustomToast("error", error || "Thanks for editing your profile")
    }
  }

  return (
    <div className="w-full justify-center items-center flex p-2">
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-xl font-semibold">Informations de Profil</h1>
          <p className="text-muted-foreground text-sm">
            Gérez les détails de votre profil et les informations de votre compte
          </p>
        </CardHeader>
        <CardContent>
          <form className="w-full flex gap-5" onSubmit={handleSubmit}>
            <div className="w-[20%] flex flex-col gap-3 items-center">
              <Avatar className="w-56 h-56">
                <AvatarImage
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : "https://avatars.githubusercontent.com/u/151373460?v=4"
                  }
                  alt="Utilisateur"
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                id="avatarUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) setSelectedImage(file)
                }}
              />
              <label htmlFor="avatarUpload" className="w-full">
                <Button type="button" className="w-full" asChild>
                  <span>
                    <Edit className="mr-2" />
                    Modifier l'image
                  </span>
                </Button>
              </label>
            </div>
            <div className="w-[80%] flex flex-col gap-3">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
                  <TabsTrigger value="address">Adresse</TabsTrigger>
                  <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <User size={20} className="mb-1" />
                      <label htmlFor="" className="text-md">
                        Nom d'affichage
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={isEnabled}
                        value={formData.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Mail size={20} className="mb-1" />
                      <label htmlFor="" className="text-md">
                        Adresse e-mail
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={isEnabled}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full flex gap-5">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Briefcase size={20} className="mb-1" />
                        <label htmlFor="" className="text-md">
                          Rôle
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input disabled value={user.role} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Calendar size={20} className="mb-1" />
                        <label htmlFor="" className="text-md">
                          Membre depuis
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input value={formatDate(user.createdAt)} disabled />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="address" className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="mb-1" />
                      <label htmlFor="" className="text-md">
                        Rue
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={isEnabled}
                        value={formData.addresses[0].street}
                        onChange={(e) => handleChange("street", e.target.value, true, 0)}
                        placeholder="123 Rue Exemple"
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-5">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Building size={20} className="mb-1" />
                        <label htmlFor="" className="text-md">
                          Ville
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          disabled={isEnabled}
                          value={formData.addresses[0].city}
                          onChange={(e) => handleChange("city", e.target.value, true, 0)}
                          placeholder="Casablanca"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Map size={20} className="mb-1" />
                        <label htmlFor="" className="text-md">
                          État/Province
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          disabled={isEnabled}
                          value={formData.addresses[0].state}
                          onChange={(e) => handleChange("state", e.target.value, true, 0)}
                          placeholder="Grand Casablanca"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex gap-5">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Globe size={20} className="mb-1" />
                        <label htmlFor="" className="text-md">
                          Pays
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          disabled={isEnabled}
                          value={formData.addresses[0].country}
                          onChange={(e) => handleChange("country", e.target.value, true, 0)}
                          placeholder="Maroc"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Hash size={20} className="mb-1" />
                        <label htmlFor="" className="text-md">
                          Code Postal
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          disabled={isEnabled}
                          value={formData.addresses[0].postalCode}
                          onChange={(e) => handleChange("postalCode", e.target.value, true, 0)}
                          placeholder="20000"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Instagram size={20} className="mb-1" />
                      <label htmlFor="" className="text-md">
                        Instagram
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={isEnabled}
                        value={formData.socialMedia.instagram}
                        onChange={(e) => handleChange("socialMedia.instagram", e.target.value)}
                        placeholder="@votrecompte"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Facebook size={20} className="mb-1" />
                      <label htmlFor="" className="text-md">
                        Facebook
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={isEnabled}
                        value={formData.socialMedia.facebook}
                        onChange={(e) => handleChange("socialMedia.facebook", e.target.value)}
                        placeholder="facebook.com/votrecompte"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Gmail size={20} className="mb-1" />
                      <label htmlFor="" className="text-md">
                        Google
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={isEnabled}
                        value={formData.socialMedia.google}
                        onChange={(e) => handleChange("socialMedia.google", e.target.value)}
                        placeholder="Compte Google"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="w-full flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Checkbox id="isSubcategory" onCheckedChange={(checked) => setIsenabled(!checked)} />
                  Activer la modification
                </div>
                <Button disabled={isEnabled}>
                  <Edit3 className="mr-2" />
                  Modifier le Profil
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileInformations
