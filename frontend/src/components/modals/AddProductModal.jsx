"use client"

import { useState, useEffect } from "react"
import {
  X,
  Plus,
  Trash2,
  Camera,
  Palette,
  Box,
  Tag,
  Truck,
  DollarSign,
  Percent,
  Layers,
  BarChart,
  Pen,
  ChevronRight,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useProducts } from "../../context/ProductContext"
import { addProduit, modifierProduit } from "../../lib/api"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import CustomToast from "../CustomToast"

export default function ProductModal({ product, mode = "add", use = "max" }) {
  const isEditMode = mode === "edit"
  const { categories, fournisseurs, setProducts } = useProducts()

  // State for form data (existing product details and Cloudinary URLs)
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: 0,
    images: [], // Existing Cloudinary URLs
    categories: [],
    subcategories: [], // Add subcategories array
    stock: 0,
    specifications: [],
    status: "active",
    sku: "",
    cost: 0,
    profit: 0,
    discount: 0,
    vente: [],
    fournisseur: "",
  })

  // State for new image files to upload
  const [imageFiles, setImageFiles] = useState([])
  const [activeTab, setActiveTab] = useState("general")
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state for submission
  const [previewUrls, setPreviewUrls] = useState([])

  // Reset form data when modal opens
  useEffect(() => {
    if (product && isEditMode && open) {
      setFormData({
        ...formData, // Keep existing formData
        productId: product._id, // Explicitly include _id
        nom: product.nom || "",
        description: product.description || "",
        prix: product.prix || 0,
        images: product.images || [],
        categories: product.categories?.map((cat) => cat._id) || [],
        subcategories: product.subcategories || [],
        stock: product.stock || 0,
        specifications: product.specifications || [],
        status: product.status || "active",
        sku: product.sku || "",
        cost: product.cost || 0,
        profit: product.profit || 0,
        discount: product.discount || 0,
        vente: product.vente || [],
        fournisseur: product.fournisseur?._id || product.fournisseur || "",
      });
      setImageFiles([]);
    } else if (!isEditMode && open) {
      setFormData({
        nom: "",
        description: "",
        prix: 0,
        images: [],
        categories: [],
        subcategories: [],
        stock: 0,
        specifications: [],
        status: "active",
        sku: "",
        cost: 0,
        profit: 0,
        discount: 0,
        vente: [],
        fournisseur: "",
      });
      setImageFiles([]);
    }
  }, [product, open, isEditMode]);

  useEffect(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    const newPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls(newPreviewUrls)
    return () => {
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      // If removing a category, also remove its subcategories
      const wasSelected = prev.categories.includes(categoryId)
      const updatedCategories = wasSelected
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId]

      // If the category was previously selected and is now being unselected,
      // remove any subcategories that belong to this category
      let updatedSubcategories = [...prev.subcategories]
      if (wasSelected) {
        // Find the category object to get its subcategories
        const category = categories.find((cat) => cat._id === categoryId)
        if (category && category.subcategories) {
          // Filter out subcategories that belong to this category
          updatedSubcategories = updatedSubcategories.filter(
            (subId) => !category.subcategories.some((sub) => sub._id === subId),
          )
        }
      }

      return {
        ...prev,
        categories: updatedCategories,
        subcategories: updatedSubcategories,
      }
    })
  }

  const handleSubcategoryChange = (subcategoryId, categoryId) => {
    setFormData((prev) => {
      const updatedSubcategories = prev.subcategories.includes(subcategoryId)
        ? prev.subcategories.filter((id) => id !== subcategoryId)
        : [...prev.subcategories, subcategoryId]

      // Ensure the parent category is selected when a subcategory is selected
      const updatedCategories = [...prev.categories]
      if (!updatedCategories.includes(categoryId) && updatedSubcategories.includes(subcategoryId)) {
        updatedCategories.push(categoryId)
      }

      return {
        ...prev,
        subcategories: updatedSubcategories,
        categories: updatedCategories,
      }
    })
  }

  const handleAddSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { nom: "", valeur: "" }],
    }))
  }

  const handleSpecificationChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedSpecs = [...prev.specifications]
      updatedSpecs[index][field] = value
      return { ...prev, specifications: updatedSpecs }
    })
  }

  const handleRemoveSpecification = (index) => {
    setFormData((prev) => {
      const updatedSpecs = [...prev.specifications]
      updatedSpecs.splice(index, 1)
      return { ...prev, specifications: updatedSpecs }
    })
  }

  const handleFileChange = (e) => {
    const maxSize = 5 * 1024 * 1024
    const newFiles = Array.from(e.target.files)
      .filter((file) => {
        if (file.size > maxSize) {
          toast.error(`Le fichier ${file.name} dépasse la limite de 5 Mo.`)
          return false
        }
        return true
      })
      .slice(0, 4 - formData.images.length)

    if (newFiles.length + formData.images.length > 4) {
      toast.error("Vous ne pouvez pas ajouter plus de 4 images au total.")
      return
    }

    setImageFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images]
      updatedImages.splice(index, 1)
      return { ...prev, images: updatedImages }
    })
  }

  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => {
      const updatedFiles = [...prev]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })

    setPreviewUrls((prev) => {
      const updatedUrls = [...prev]
      updatedUrls.splice(index, 1)
      return updatedUrls
    })
  }

  const calculatedProfit = formData.prix - formData.cost
  const profitMargin = formData.cost > 0 ? (((formData.prix - formData.cost) / formData.prix) * 100).toFixed(2) : 0


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validateForm = () => {
        const errors = [];
        if (!formData.nom) errors.push("Le nom du produit est requis");
        if (!formData.description) errors.push("La description est requise");
        if (formData.prix === undefined || formData.prix === null || isNaN(formData.prix)) {
          errors.push("Le prix doit être un nombre valide");
        } else if (formData.prix <= 0) {
          errors.push("Le prix doit être supérieur à 0");
        }
        if (formData.stock < 0) errors.push("Le stock ne peut pas être négatif");
        if (formData.cost < 0) errors.push("Le coût ne peut pas être négatif");
        if (formData.discount < 0 || formData.discount > 100) {
          errors.push("La remise doit être entre 0 et 100");
        }
        if (formData.categories.length === 0) {
          errors.push("Veuillez sélectionner au moins une catégorie");
        }
        if (formData.specifications.some(spec => typeof spec !== 'object' || !spec.nom || !spec.valeur)) {
          errors.push("Toutes les spécifications doivent être des objets avec un nom et une valeur");
        }
        if (errors.length > 0) {
          CustomToast('error', errors.join("\n"));
          return;
        }

      };
      validateForm();

      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "specifications") {
          formDataToSubmit.append(key, JSON.stringify(value)); // ✅ stringify object array
        } else if (Array.isArray(value)) {
          value.forEach((item) => formDataToSubmit.append(`${key}[]`, item));
        } else {
          formDataToSubmit.append(key, value);
        }
      });


      imageFiles.forEach((file) => {
        formDataToSubmit.append("images", file);
      });
      if (isEditMode && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSubmit.append("existingImages[]", image);
        });
      }

      console.log("formdata avant l'envoi: ", formDataToSubmit);
      const res = isEditMode
        ? await modifierProduit(product._id, formDataToSubmit)
        : await addProduit(formDataToSubmit);

      CustomToast('success', `Produit ${isEditMode ? 'modifié' : 'ajouté'} avec succès`);
      setProducts((prev) => {
        if (isEditMode) {
          return prev.map((p) => (p._id === product._id ? { ...p, ...res.data.produit } : p));
        }
        return [...prev, res.data.produit];  // Ensure you're using the full product object here
      });
      setOpen(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Erreur:", error);
      CustomToast('error', error.response?.data?.message || "Erreur lors de l'ajout ou la modification du produit");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     // Validation
  //     const validateForm = () => {
  //       const errors = [];
  //       if (!formData.nom) errors.push("Le nom du produit est requis");
  //       if (!formData.description) errors.push("La description est requise");
  //       if (formData.prix === undefined || formData.prix === null || isNaN(formData.prix)) {
  //         errors.push("Le prix doit être un nombre valide");
  //       } else if (formData.prix <= 0) {
  //         errors.push("Le prix doit être supérieur à 0");
  //       }
  //       if (formData.stock < 0) errors.push("Le stock ne peut pas être négatif");
  //       if (formData.cost < 0) errors.push("Le coût ne peut pas être négatif");
  //       if (formData.discount < 0 || formData.discount > 100) {
  //         errors.push("La remise doit être entre 0 et 100");
  //       }
  //       if (formData.categories.length === 0) {
  //         errors.push("Veuillez sélectionner au moins une catégorie");
  //       }
  //       if (formData.specifications.some(spec => !spec.nom || !spec.valeur)) {
  //         errors.push("Toutes les spécifications doivent avoir un nom et une valeur");
  //       }
  //       if (errors.length > 0) {
  //         throw new Error(errors.join("\n"));
  //       }
  //     };
  //     validateForm();

  //     const formDataToSubmit = new FormData();

  //     // Essential fields
  //     const fields = {
  //       nom: formData.nom,
  //       description: formData.description,
  //       prix: isNaN(formData.prix) || formData.prix === null ? "0" : String(formData.prix),
  //       stock: String(formData.stock),
  //       sku: formData.sku,
  //       profit: String(calculatedProfit),
  //       discount: String(formData.discount),
  //       vente: String(formData.vente),
  //       cost: String(formData.cost),
  //       status: formData.status,
  //     };
  //     Object.entries(fields).forEach(([key, value]) => {
  //       if (value !== undefined && value !== null) {
  //         formDataToSubmit.append(key, value);
  //       }
  //     });

  //     // Categories and subcategories
  //     formData.categories.forEach(id => formDataToSubmit.append("categories[]", id));
  //     formData.subcategories.forEach(id => formDataToSubmit.append("subcategories[]", id));

  //     // Specifications
  //     if (formData.specifications?.length > 0) {
  //       formDataToSubmit.append("specifications", JSON.stringify(formData.specifications));
  //     }

  //     // Fournisseur
  //     if (formData.fournisseur) {
  //       formDataToSubmit.append("fournisseur", formData.fournisseur);
  //     }

  //     // Images
  //     imageFiles.forEach(file => formDataToSubmit.append("images", file));
  //     if (isEditMode) {
  //       formData.images.forEach(img => formDataToSubmit.append("existingImages[]", img));
  //       if (product?._id) {
  //         formDataToSubmit.append("productId", product._id); // Use "productId" as expected by backend
  //       } else {
  //         throw new Error("Product ID is missing");
  //       }
  //     }

  //     // Debugging
  //     console.log("--- FormData Contents ---", formDataToSubmit);


  //     // API Call
  //     const response = isEditMode
  //       ? await modifierProduit(product._id, formDataToSubmit)
  //       : await addProduit(formDataToSubmit);

  //     // Update state
  //     setProducts(prev => isEditMode
  //       ? prev.map(p => p._id === product._id ? response.produit : p)
  //       : [...prev, response.data.produit]
  //     );
  //     CustomToast("success", `Produit ${isEditMode ? "modifié" : "ajouté"} avec succès`);
  //     setOpen(false);
  //   } catch (error) {
  //     console.error("Erreur:", error);
  //     const errorMessage = error.response?.data?.message || error.message;
  //     toast.error(errorMessage.includes("\n")
  //       ? "Plusieurs erreurs:\n" + errorMessage
  //       : errorMessage
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "outOfStock":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-blue-100 text-blue-800 border-blue-300"
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const generalInputs = [
    {
      id: "nom",
      name: "nom",
      label: "Nom*",
      type: "text",
      value: formData.nom,
      onChange: handleChange,
      required: true,
      placeholder: "Nom du produit",
      icon: <Tag className="h-4 w-4 mr-2" />,
      colSpan: "full",
    },
    {
      id: "description",
      name: "description",
      label: "Description*",
      type: "textarea",
      value: formData.description,
      onChange: handleChange,
      required: true,
      placeholder: "Description détaillée du produit",
      rows: 4,
      icon: <Palette className="h-4 w-4 mr-2" />,
      colSpan: "full",
    },
    {
      id: "prix",
      name: "prix",
      label: "Prix*",
      type: "number",
      value: formData.prix || "",
      onChange: handleNumberChange,
      required: true,
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      colSpan: "half",
    },
    {
      id: "stock",
      name: "stock",
      label: "Stock",
      type: "number",
      value: formData.stock,
      onChange: handleNumberChange,
      icon: <Box className="h-4 w-4 mr-2 " />,
      colSpan: "half",
    },
  ]

  const detailsInputs = [
    {
      id: "sku",
      name: "sku",
      label: "SKU",
      type: "text",
      value: formData.sku || "",
      onChange: handleChange,
      icon: <Tag className="h-4 w-4 mr-2" />,
      colSpan: "half",
    },
    {
      id: "cost",
      name: "cost",
      label: "Coût",
      type: "number",
      value: formData.cost || "",
      onChange: handleNumberChange,
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      colSpan: "third",
    },
    {
      id: "profit",
      name: "profit",
      label: "Profit",
      type: "number",
      value: formData.profit || "",
      onChange: handleNumberChange,
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      colSpan: "third",
    },
    {
      id: "discount",
      name: "discount",
      label: "Remise (%)",
      type: "number",
      value: formData.discount || "",
      onChange: handleNumberChange,
      icon: <Percent className="h-4 w-4 mr-2" />,
      colSpan: "third",
    },
  ]

  const tabs = [
    { id: "general", label: "Général", icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: "details", label: "Détails", icon: <BarChart className="h-4 w-4 mr-2" /> },
    { id: "images", label: "Images", icon: <Camera className="h-4 w-4 mr-2" /> },
    { id: "specifications", label: "Spécifications", icon: <Box className="h-4 w-4 mr-2" /> },
  ]

  const renderInput = (input) => {
    const { id, name, type, value, onChange, required, placeholder, rows, colSpan } = input
    const colSpanClass =
      colSpan === "full"
        ? "col-span-full"
        : colSpan === "half"
          ? "col-span-1 md:col-span-1"
          : colSpan === "third"
            ? "col-span-1 md:col-span-1"
            : "col-span-1"
    const baseClasses = "border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"

    if (type === "textarea") {
      return (
        <div className={`space-y-2 ${colSpanClass}`}>
          <Label htmlFor={id} className="text-sm font-medium flex items-center">
            {input.icon}
            {input.label}
          </Label>
          <Textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows || 4}
            required={required}
            className={baseClasses}
            placeholder={placeholder}
          />
        </div>
      )
    }
    return (
      <div className={`space-y-2 ${colSpanClass}`}>
        <Label htmlFor={id} className="text-sm font-medium flex items-center">
          {input.icon}
          {input.label}
        </Label>
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
          placeholder={placeholder}
        />
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            variant={use === "min" ? "ghost" : ""}
            className={`cursor-pointer ${use === "max" && "w-full text-white"} hover:bg-black/70`}
          >
            {use === "max" ? (
              <>
                <Pen className="h-5 w-5" /> Modifier Produit
              </>
            ) : (
              <Pen className="h-5 w-5" />
            )}
          </Button>
        ) : (
          <Button>
            <Plus className="h-5 w-5" /> Ajouter Produit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-primary">
            {isEditMode ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4 p-1 bg-gray-50 rounded-md w-full">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-secondary data-[state=active]:shadow-sm rounded-sm transition-all duration-200 flex items-center justify-center"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial="hidden" animate="visible" exit="hidden" variants={tabVariants}>
                {/* General Tab */}
                {activeTab === "general" && (
                  <TabsContent value="general" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generalInputs.map((input) => renderInput(input))}
                      <div className="space-y-2 col-span-full">
                        <Label htmlFor="status" className="text-sm font-medium">
                          Statut
                        </Label>
                        <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                          <SelectTrigger className="border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 w-full">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>Actif
                              </div>
                            </SelectItem>
                            <SelectItem value="inactive">
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>Inactif
                              </div>
                            </SelectItem>
                            <SelectItem value="outOfStock">
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>Rupture de stock
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 col-span-full">
                        <div className="text-sm text-gray-500 mb-2">Aperçu du produit</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{formData.nom || "Nom du produit"}</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {formData.description || "Description du produit"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(formData.status)}>
                              {formData.status === "active"
                                ? "Actif"
                                : formData.status === "inactive"
                                  ? "Inactif"
                                  : "Rupture"}
                            </Badge>
                            <span className="font-bold text-lg">{formData.prix ? `${formData.prix}MAD` : "0MAD"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* Details Tab */}
                {activeTab === "details" && (
                  <TabsContent value="details" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detailsInputs.map((input) => renderInput(input))}
                      <div className="space-y-2 col-span-2 md:col-span-2">
                        <Label htmlFor="fournisseur" className="text-sm font-medium flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-purple-500" />
                          Fournisseur
                        </Label>
                        <Select
                          value={formData.fournisseur || ""}
                          onValueChange={(value) => handleSelectChange("fournisseur", value)}
                        >
                          <SelectTrigger className="border-gray-300 focus:ring-purple-500 focus:border-purple-500 w-full">
                            <SelectValue placeholder="Sélectionner un fournisseur" />
                          </SelectTrigger>
                          <SelectContent>
                            {fournisseurs.map((supplier) => (
                              <SelectItem key={supplier._id} value={supplier._id}>
                                {supplier.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-sm font-medium mb-2">Marge bénéficiaire</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min(profitMargin, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>0%</span>
                        <span>{profitMargin}%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Categories with subcategories */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Catégories et Sous-catégories
                      </Label>

                      <Accordion type="multiple" className="w-full">
                        {categories.map((category) => (
                          <AccordionItem
                            key={category._id}
                            value={category._id}
                            className="border border-gray-200 rounded-md mb-2 overflow-hidden"
                          >
                            <div className="flex items-center px-4 py-2">
                              <input
                                type="checkbox"
                                id={`category-${category._id}`}
                                checked={formData.categories.includes(category._id)}
                                onChange={() => handleCategoryChange(category._id)}
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                              />
                              <Label htmlFor={`category-${category._id}`} className="flex-1 text-sm font-medium">
                                {category.nom}
                              </Label>

                              {/* Only show accordion trigger if there are subcategories */}
                              {category.subcategories && category.subcategories.length > 0 && (
                                <AccordionTrigger className="p-0" />
                              )}
                            </div>

                            {category.subcategories && category.subcategories.length > 0 && (
                              <AccordionContent>
                                <div className="pl-8 pr-4 pb-2 space-y-1 border-t border-gray-100 pt-1">
                                  {category.subcategories.map((subcategory) => (
                                    <div key={subcategory._id} className="flex items-center py-1">
                                      <input
                                        type="checkbox"
                                        id={`subcategory-${subcategory._id}`}
                                        checked={formData.subcategories.includes(subcategory._id)}
                                        onChange={() => handleSubcategoryChange(subcategory._id, category._id)}
                                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                                        // Disable subcategory selection if parent category is not selected
                                        disabled={!formData.categories.includes(category._id)}
                                      />
                                      <Label
                                        htmlFor={`subcategory-${subcategory._id}`}
                                        className={`text-sm ${!formData.categories.includes(category._id) ? "text-gray-400" : ""}`}
                                      >
                                        {subcategory.nom}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            )}
                          </AccordionItem>
                        ))}
                      </Accordion>

                      {/* Show selected categories and subcategories */}
                      {(formData.categories.length > 0 || formData.subcategories.length > 0) && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium mb-2">Sélections:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.categories.map((catId) => {
                              const category = categories.find((c) => c._id === catId)
                              if (!category) return null

                              return (
                                <Badge key={catId} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                  {category.nom}
                                  <button
                                    type="button"
                                    className="ml-1 hover:text-red-500"
                                    onClick={() => handleCategoryChange(catId)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )
                            })}

                            {formData.subcategories.map((subId) => {
                              // Find which category this subcategory belongs to
                              let parentCategory = null
                              let subcategory = null

                              for (const cat of categories) {
                                if (!cat.subcategories) continue
                                const sub = cat.subcategories.find((s) => s._id === subId)
                                if (sub) {
                                  subcategory = sub
                                  parentCategory = cat
                                  break
                                }
                              }

                              if (!subcategory) return null

                              return (
                                <Badge key={subId} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  {parentCategory.nom} <ChevronRight className="h-3 w-3 inline" /> {subcategory.nom}
                                  <button
                                    type="button"
                                    className="ml-1 hover:text-red-500"
                                    onClick={() => handleSubcategoryChange(subId, parentCategory._id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                {/* Images Tab */}
                {activeTab === "images" && (
                  <TabsContent value="images" className="space-y-4 mt-0">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <Camera className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Cliquez pour sélectionner des images (max 4, 5 Mo chacun)
                        </span>
                        <span className="text-xs text-gray-400 mt-1">ou glissez-déposez ici</span>
                      </label>
                    </div>

                    {imageFiles.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">
                          Nouvelles images à uploader ({imageFiles.length})
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <AnimatePresence>
                            {imageFiles.map((file, index) => (
                              <motion.div
                                key={index}
                                className="relative border rounded-md overflow-hidden group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                <img
                                  src={previewUrls[index] || "/placeholder.svg"}
                                  alt={`New image ${index + 1}`}
                                  className="w-full h-auto object-cover aspect-square"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => handleRemoveNewImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {formData.images.length > 0 && (
                      <div className="mt-6">
                        <div className="text-sm font-medium mb-2">Images actuelles ({formData.images.length}/4)</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <AnimatePresence>
                            {formData.images.map((image, index) => (
                              <motion.div
                                key={index}
                                className="relative border rounded-md overflow-hidden group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Product image ${index}`}
                                  className="w-full h-auto object-cover aspect-square"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => handleRemoveImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                )}

                {/* Specifications Tab */}
                {activeTab === "specifications" && (
                  <TabsContent value="specifications" className="space-y-4 mt-0">
                    <AnimatePresence>
                      {formData.specifications.map((spec, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        >
                          <div className="flex-1">
                            <Label htmlFor={`spec-name-${index}`} className="sr-only">
                              Nom de la spécification
                            </Label>
                            <Input
                              id={`spec-name-${index}`}
                              value={spec.nom}
                              onChange={(e) => handleSpecificationChange(index, "nom", e.target.value)}
                              placeholder="Nom (ex: Couleur, Taille)"
                              className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`spec-value-${index}`} className="sr-only">
                              Valeur de la spécification
                            </Label>
                            <Input
                              id={`spec-value-${index}`}
                              value={spec.valeur}
                              onChange={(e) => handleSpecificationChange(index, "valeur", e.target.value)}
                              placeholder="Valeur (ex: Rouge, XL)"
                              className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSpecification(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {formData.specifications.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Box className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>Aucune spécification ajoutée</p>
                        <p className="text-sm">Ajoutez des spécifications pour décrire votre produit en détail</p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSpecification}
                      className="w-full mt-4 border-dashed border-gray-300 hover:border-purple-500 hover:text-purple-600 transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Ajouter une spécification
                    </Button>
                  </TabsContent>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>

          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "En cours..." : isEditMode ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
