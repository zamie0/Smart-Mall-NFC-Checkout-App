import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Calendar, LogOut, Receipt, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
  const { user, isAuthenticated, logout, getPurchaseHistory } = useAuth();
  const navigate = useNavigate();
  const history = getPurchaseHistory();

  if (!isAuthenticated || !user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-hero">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center h-16 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="ml-3 font-bold text-lg text-foreground">Profile</h1>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* User Info Card */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <Calendar className="w-4 h-4" />
                Member since {format(new Date(user.createdAt), 'MMM yyyy')}
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Purchase History</h3>
            <span className="ml-auto text-sm text-muted-foreground">{history.length} orders</span>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No purchases yet</p>
              <p className="text-sm text-muted-foreground mt-1">Your order history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {history.map((purchase) => (
                <div key={purchase.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {format(new Date(purchase.date), 'dd MMM yyyy, h:mm a')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {purchase.items.length} items
                      </p>
                    </div>
                    <p className="font-bold text-primary">RM {purchase.total.toFixed(2)}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {purchase.items.map((item, i) => (
                      <span key={i}>
                        {item.name} x{item.quantity}
                        {i < purchase.items.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-destructive text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </main>
    </div>
  );
};

export default Profile;
