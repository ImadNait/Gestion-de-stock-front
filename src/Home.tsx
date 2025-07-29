import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Produit {
  id: number;
  name: string;
  desc: string;
  price: string;
  img: string | null;
  quantite: number;
}

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editProduit, setEditProduit] = useState<Produit | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchProduits = async () => {
    let query = "";
    if (searchTerm) query += `?name=${searchTerm}`;
    const res = await api.get(`/produits/${query}`);
    let data = res.data;

    if (filter === "A-Z") {
      data = [...data].sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "Z-A") {
      data = [...data].sort((a, b) => b.name.localeCompare(a.name));
    }
    setProduits(data);
  };

  useEffect(() => {
    fetchProduits();
  }, [filter, searchTerm]);

  const deleteProduit = async (id: number) => {
    await api.delete(`/produits/delete/${id}/`);
    fetchProduits();
  };

  const handleFilterChange = (value: string) => setFilter(value);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleEditSubmit = async () => {
  if (!editProduit) return;
  const formData = new FormData();
  formData.append("name", editProduit.name);
  formData.append("desc", editProduit.desc);
  formData.append("price", editProduit.price);
  formData.append("quantite", editProduit.quantite.toString());
  if (editProduit.img instanceof File) {
    formData.append("img", editProduit.img);
  }

  await api.put(`/produits/update/${editProduit.id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  setIsEditDialogOpen(false);
  fetchProduits();
};

  const handleAddProduit = async () => {
  if (!editProduit) return;
  const formData = new FormData();
  formData.append("name", editProduit.name);
  formData.append("desc", editProduit.desc);
  formData.append("price", editProduit.price);
  formData.append("quantite", editProduit.quantite.toString());
  if (editProduit.img instanceof File) {
    formData.append("img", editProduit.img);
  }

  await api.post(`/produits/add/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  setIsAddDialogOpen(false);
  fetchProduits();
};


  return (
    <section
      className={`p-6 space-y-4 px-4 h-screen overflow-hidden ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Select onValueChange={handleFilterChange} value={filter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="All" className="hover:bg-gray-200">All</SelectItem>
            <SelectItem value="A-Z" className="hover:bg-gray-200">A-Z</SelectItem>
            <SelectItem value="Z-A" className="hover:bg-gray-200">Z-A</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Name"
                onChange={(e) =>
                  setEditProduit({
                    ...(editProduit || {
                      id: 0,
                      name: "",
                      desc: "",
                      price: "",
                      img: null,
                      quantite: 0,
                    }),
                    name: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Description"
                onChange={(e) =>
                  setEditProduit({
                    ...(editProduit || {
                      id: 0,
                      name: "",
                      desc: "",
                      price: "",
                      img: null,
                      quantite: 0,
                    }),
                    desc: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Price"
                onChange={(e) =>
                  setEditProduit({
                    ...(editProduit || {
                      id: 0,
                      name: "",
                      desc: "",
                      price: "",
                      img: null,
                      quantite: 0,
                    }),
                    price: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Quantite"
                onChange={(e) =>
                  setEditProduit({
                    ...(editProduit || {
                      id: 0,
                      name: "",
                      desc: "",
                      price: "",
                      img: null,
                      quantite: 0,
                    }),
                    quantite: parseInt(e.target.value),
                  })
                }
              />
              <Input
                type="file"
                onChange={(e) =>
                  setEditProduit({
                    ...(editProduit || {
                      id: 0,
                      name: "",
                      desc: "",
                      price: "",
                      img: null,
                      quantite: 0,
                    }),
                    img: e.target.files?.[0] || null,
                  })
                }
              />
              <Button
                onClick={handleAddProduit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {produits.map((produit) => (
          <Card key={produit.id} className="bg-gray-800 text-white">
            <CardContent className="p-4 space-y-2">
              {produit.img && (
                <img
                  src={`http://localhost:8000${produit.img}`}
                  alt={produit.name}
                  className="w-full h-80 object-cover rounded"
                />
              )}
              <h2 className="text-lg font-semibold">{produit.name}</h2>
              <p>{produit.desc}</p>
              <p className="font-medium">Price: {produit.price}</p>
              <p className="text-sm text-muted">Quantite: {produit.quantite}</p>
              <div className="flex flex-col gap-2">
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-gray-600"
                      onClick={() => {
                        setEditProduit(produit);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        defaultValue={editProduit?.name}
                        onChange={(e) =>
                          setEditProduit({
                            ...(editProduit || produit),
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        defaultValue={editProduit?.desc}
                        onChange={(e) =>
                          setEditProduit({
                            ...(editProduit || produit),
                            desc: e.target.value,
                          })
                        }
                      />
                      <Input
                        defaultValue={editProduit?.price}
                        onChange={(e) =>
                          setEditProduit({
                            ...(editProduit || produit),
                            price: e.target.value,
                          })
                        }
                      />
                      <Input
                        defaultValue={editProduit?.quantite.toString()}
                        onChange={(e) =>
                          setEditProduit({
                            ...(editProduit || produit),
                            quantite: parseInt(e.target.value),
                          })
                        }
                      />
                      <Input
                        type="file"
                        onChange={(e) =>
                          setEditProduit({
                            ...(editProduit || produit),
                            img: e.target.files?.[0] || null,
                          })
                        }
                      />
                      <Button
                        onClick={handleEditSubmit}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Update
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  className="w-full hover:bg-red-700"
                  onClick={() => deleteProduit(produit.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
