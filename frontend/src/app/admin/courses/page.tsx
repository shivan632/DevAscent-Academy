'use client';

import React from 'react';
import useSWR from 'swr';
import { api } from '../../../lib/api';
import { KpiSkeleton, StatusBadge, EmptyState } from '../../../components/admin/AdminUI';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export default function CoursesPage() {
  const { data, isLoading } = useSWR('/admin/courses', () => api.admin.getCourseStats());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Course Management</h1>
        <p className="text-sm text-white/35 mt-0.5">Enrollment stats per course</p>
      </div>

      {isLoading ? (
        <KpiSkeleton />
      ) : !data?.courses?.length ? (
        <EmptyState message="No courses found." />
      ) : (
        <div className="space-y-3">
          {data.courses.map((course: any) => (
            <div key={course.id} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{course.title}</h3>
                      <StatusBadge status={course.isPublished ? 'ACTIVE' : 'REJECTED'} />
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/40 font-semibold border border-white/8 uppercase">
                        {course.type}
                      </span>
                    </div>
                    <p className="text-xs text-white/35 mt-0.5">/courses/{course.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-white/40 text-xs mb-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </div>
                    <p className="text-xl font-extrabold text-white">{course.enrollmentCount}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-white/40 text-xs mb-0.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Certs</span>
                    </div>
                    <p className="text-xl font-extrabold text-white">{course.certificateCount}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-white/40 text-xs mb-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Avg Progress</span>
                    </div>
                    <p className="text-xl font-extrabold text-white">{course.avgProgress}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/40 mb-0.5">Revenue</p>
                    <p className="text-xl font-extrabold text-emerald-400">
                      ₹{course.revenueRupees.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/35 mb-1.5">
                  <span>Average completion</span>
                  <span>{course.avgProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all"
                    style={{ width: `${course.avgProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
