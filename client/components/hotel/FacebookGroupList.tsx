import { Facebook } from 'lucide-react';
import { BackendFbGroup } from '@/hooks/use-backend-api';

export function FacebookGroupList({ groups }: { groups: BackendFbGroup[] }) {
  const active = groups.filter(g => g.isActive);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center gap-2 mb-2">
        <Facebook className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold text-lg">Cộng đồng Facebook</h3>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Dữ liệu tổng hợp từ {active.length} nhóm tại Đà Nẵng
      </p>

      <div className="space-y-2">
        {active.map((group) => (
          <a
            key={group.id}
            href={group.url ?? `https://www.facebook.com/groups/${group.fbGroupId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors border border-slate-100 group"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Facebook className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {group.name ?? `Nhóm ${group.fbGroupId}`}
              </p>
              {group.memberCount ? (
                <p className="text-xs text-slate-500 mt-0.5">
                  {group.memberCount.toLocaleString('vi-VN')} thành viên
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">Nhóm cầu lông Đà Nẵng</p>
              )}
            </div>

            <Facebook className="h-4 w-4 text-blue-400 flex-shrink-0" />
          </a>
        ))}

        {active.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">Đang tải nhóm…</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-slate-500 text-center">
          ✓ Các nhóm được xác minh và tin cậy bởi cộng đồng
        </p>
      </div>
    </div>
  );
}
