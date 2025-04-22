import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import CategoryModal from "./modals/CategorieModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function CategoriesTable({ categoriesData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedSubcategories, setExpandedSubcategories] = useState({});
    const itemsPerPage = 10;

    // Calculate pagination values
    const totalItems = categoriesData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentCategories = categoriesData.slice(startIndex, endIndex);

    // Handle page changes
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Toggle expanded state for a category
    const toggleExpanded = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Toggle expanded state for a subcategory
    const toggleSubcategoryExpanded = (subcategoryId) => {
        setExpandedSubcategories(prev => ({
            ...prev,
            [subcategoryId]: !prev[subcategoryId]
        }));
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    };

    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Produits</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    Aucune catégorie trouvée
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentCategories.map((category) => (
                                <React.Fragment key={category._id}>
                                    {/* Main Category Row */}
                                    <TableRow>
                                        <TableCell>
                                            {category.subcategories && category.subcategories.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => toggleExpanded(category._id)}
                                                >
                                                    {expandedCategories[category._id] ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{category.nom}</TableCell>
                                        <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{category.produits ? category.produits.length : 0}</Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(category.createdAt)}</TableCell>
                                        <TableCell>
                                            <Actions categorie={category} />
                                        </TableCell>
                                    </TableRow>

                                    {/* First Level Subcategories */}
                                    {expandedCategories[category._id] && category.subcategories && category.subcategories.map(subCategory => (
                                        <React.Fragment key={subCategory._id}>
                                            {/* Subcategory Row */}
                                            <TableRow className="bg-muted/30">
                                                <TableCell>
                                                    {subCategory.subcategories && subCategory.subcategories.length > 0 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => toggleSubcategoryExpanded(subCategory._id)}
                                                        >
                                                            {expandedSubcategories[subCategory._id] ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell className="pl-8">
                                                    <div className="flex items-center">
                                                        <div className="h-6 w-6 mr-2 flex items-center justify-center">
                                                            <div className="h-px w-4 bg-muted-foreground"></div>
                                                        </div>
                                                        {subCategory.nom}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">{subCategory.description}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{subCategory.produits ? subCategory.produits.length : 0}</Badge>
                                                </TableCell>
                                                <TableCell>{formatDate(subCategory.createdAt)}</TableCell>
                                                <TableCell>
                                                    <Actions categorie={subCategory} />
                                                </TableCell>
                                            </TableRow>

                                            {/* Second Level Subcategories (Sub-subcategories) */}
                                            {expandedSubcategories[subCategory._id] && subCategory.subcategories && subCategory.subcategories.map(subSubCategory => (
                                                <TableRow key={subSubCategory._id} className="bg-muted/50">
                                                    <TableCell></TableCell>
                                                    <TableCell className="font-medium bg-red-600">
                                                        <Badge variant="outline" className="truncate w-full ">{subSubCategory._id}</Badge>
                                                    </TableCell>
                                                    <TableCell className="pl-16">
                                                        <div className="flex items-center">
                                                            <div className="h-6 w-6 mr-2 flex items-center justify-center">
                                                                <div className="h-px w-4 bg-muted-foreground"></div>
                                                            </div>
                                                            {subSubCategory.nom}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">{subSubCategory.description}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{subSubCategory.produits ? subSubCategory.produits.length : 0}</Badge>
                                                    </TableCell>
                                                    <TableCell>{formatDate(subSubCategory.createdAt)}</TableCell>
                                                    <TableCell>
                                                        <Actions categorie={subCategory} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 border-t">
                    <div className="text-sm text-muted-foreground">
                        Affichage de {totalItems > 0 ? startIndex + 1 : 0} à {endIndex} sur {totalItems} catégories
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum = i + 1;

                                // If we have more than 5 pages and we're not at the beginning
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 3 + i;

                                    // Don't go beyond the total pages
                                    if (pageNum > totalPages) {
                                        pageNum = totalPages - (4 - i);
                                    }
                                }

                                return (
                                    <Button
                                        key={i}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => handlePageChange(pageNum)}
                                        className="w-9 h-9"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}


const Actions = ({ categorie }) => {
    return (

        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="w-5 h-5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <CategoryModal mode="edit" categorie={categorie} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}